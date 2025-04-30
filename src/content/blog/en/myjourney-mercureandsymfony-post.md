<img src="https://plus.unsplash.com/premium_photo-1677252438450-b779a923b0f6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVzc2FnZXxlbnwwfHwwfHx8MA%3D%3D" class="mx-auto" alt="Chat bubble" width="700px"/>

<i>Reading time : 10 minutes</i>

## Introduction

Recently, i created a chat application using Symfony and Mercure. This blog post is dedicated to sharing that experience, highlighting the setup process and discussing the benefits of integrating Mercure into Symfony applications.

### What is mercure

Mercure is a robust open-source solution designed for real-time communications, celebrated for its speed and efficiency. It serves as a compelling alternative to conventional WebSocket services and complements REST and GraphQL APIs by delivering asynchronous capabilities. Mercure's core functionality leverages HTTP and SSE (Server-Sent Events), which are inherently supported by modern web and mobile applications alongside IoT devices.

## Setup

Before you start, ensure Docker Desktop is installed and running on your machine. Here's how you can proceed with setting up your Symfony project and Mercure.

```
symfony new chat
```

Since symfony is a fullstack framework we are going to use twig to render our views.

```
composer require symfony/twig-bundle
```

This command will create a template folder in your project, with a basic structure. Since this post is about symfony and mercure we will not cover twig in depth. You can find the documentation [here](https://twig.symfony.com/doc/3.x/intro.html)

Then we need to install the mercure bundle so we can follow the documentation: [Pushing Data to Clients Using the Mercure Protocol](https://symfony.com/doc/current/mercure.html)

```
composer require mercure
```

Make sure to type <strong>Yes</strong> when he ask for the installation with docker. And we can run the docker container with the following command:

```
docker compose up -d
```

You will find the container in the docker desktop app, and you can access it with the url (http://localhost:8000/.well-known/mercure) and if you go to the url, the page should be blank it means that the container is up and running.

Make sure to customize your Mercure JWT secret in your `.env` file and `docker-compose.yaml` for production environments to ensure optimal security:

### What is mercure hub ?

![alt mercureHubSchema](https://raw.githubusercontent.com/dunglas/mercure/master/spec/subscriptions.png)

The Mercure Hub serves as the central point for the real-time communication system, efficiently transferring data between publishers (data senders) and subscribers (data receivers). This design ensures streamlined and instantaneous data flow across various app components, maintaining sync and coherence.

let's create a new service named MessageService.php.

```php
<?php

namespace App\Service;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\HttpFoundation\Response;

class MessageService extends AbstractController {
    private $hub;

    public function __construct(HubInterface $hub) {
        $this->hub = $hub;
    }

    public function sendMessage(string $content) {
        $update = new Update(
            'https://example.com/messages',
            json_encode([
                'status' => $content,
            ])
            );
            $this->hub->publish($update);
            return new Response("data published");
    }
}
```

We provide the HubInterface to the constructor, which is used to publish updates to the Mercure Hub.
The update method is used to create an update object, which contains the URL and the data to be sent.

Now let's create a new controller named MessageController.php.

```
symfony make:controller MessageController
```

```php
<?php

namespace App\Controller;

use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MessageController extends AbstractController
{
    private $messageService;
    public function __construct(MessageService $messageService) {
        $this->messageService = $messageService;
    }


    #[Route('/message', name: 'get_message', methods: ['GET'])]
    public function getMessage() : Response {
        $messages = $this->messageService->getMessage();
        return $this->render('message/index.html.twig', [
            'messages' => $messages,
        ]);
        return $this->render('message/index.html.twig');
    }

    #[Route('/message', name: 'send_message', methods: ['POST'])]
    public function sendMessage(Request $request) {
        $content = $request->get('content');
        $author = $this->getUser();
        if ($author) {
            $author = $author->getUserIdentifier();
        }
        else {
            throw new \Exception("No User is authenticated ! ");
        }
        $this->messageService->sendMessage($content, $author);
        return $this->redirect('message');
    }
}
```
