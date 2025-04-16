<img src="https://plus.unsplash.com/premium_photo-1677252438450-b779a923b0f6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVzc2FnZXxlbnwwfHwwfHx8MA%3D%3D" class="mx-auto" alt="Bulle de discussion" width="700px"/>

<i>Temps de lecture : 10 minutes</i>

# Introduction

Récemment, j'ai créé une application de chat utilisant Symfony et Mercure. Cet article de blog est dédié au partage de cette expérience, en mettant en évidence le processus d'installation et en discutant des avantages de l'intégration de Mercure dans les applications Symfony.

## Qu'est-ce que Mercure

Mercure est une solution open-source robuste conçue pour les communications en temps réel, reconnue pour sa rapidité et son efficacité. Il constitue une alternative convaincante aux services WebSocket conventionnels et complète les API REST et GraphQL en offrant des capacités asynchrones. La fonctionnalité principale de Mercure s'appuie sur HTTP et SSE (Server-Sent Events), qui sont nativement pris en charge par les applications web et mobiles modernes ainsi que par les appareils IoT.

# Installation

Avant de commencer, assurez-vous que Docker Desktop est installé et fonctionne sur votre machine. Voici comment procéder pour configurer votre projet Symfony et Mercure.

```
symfony new chat
```

Comme Symfony est un framework fullstack, nous allons utiliser Twig pour rendre nos vues.

```
composer require symfony/twig-bundle
```

Cette commande créera un dossier template dans votre projet, avec une structure de base. Comme cet article concerne Symfony et Mercure, nous n'approfondirons pas Twig. Vous pouvez trouver la documentation [ici](https://twig.symfony.com/doc/3.x/intro.html)

Ensuite, nous devons installer le bundle Mercure, nous pouvons donc suivre la documentation : [Transmettre des données aux clients à l'aide du protocole Mercure](https://symfony.com/doc/current/mercure.html)

```
composer require mercure
```

Assurez-vous de taper <strong>Yes</strong> lorsqu'il demande l'installation avec Docker. Et nous pouvons exécuter le conteneur Docker avec la commande suivante :

```
docker compose up -d
```

Vous trouverez le conteneur dans l'application Docker Desktop, et vous pouvez y accéder via l'URL (http://localhost:8000/.well-known/mercure). Si vous accédez à cette URL, la page devrait être vide, ce qui signifie que le conteneur est opérationnel.

Assurez-vous de personnaliser votre secret JWT Mercure dans votre fichier `.env` et `docker-compose.yaml` pour les environnements de production afin de garantir une sécurité optimale :

## Qu'est-ce que le hub Mercure ?

![alt schéma du hub Mercure](https://raw.githubusercontent.com/dunglas/mercure/master/spec/subscriptions.png)

Le Hub Mercure sert de point central pour le système de communication en temps réel, transférant efficacement les données entre les éditeurs (émetteurs de données) et les abonnés (récepteurs de données). Cette conception assure un flux de données rationalisé et instantané à travers divers composants de l'application, maintenant la synchronisation et la cohérence.

Créons un nouveau service nommé MessageService.php.

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

Nous fournissons l'interface HubInterface au constructeur, qui est utilisée pour publier des mises à jour sur le Hub Mercure.
La méthode update est utilisée pour créer un objet de mise à jour, qui contient l'URL et les données à envoyer.

Maintenant, créons un nouveau contrôleur nommé MessageController.php.

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
