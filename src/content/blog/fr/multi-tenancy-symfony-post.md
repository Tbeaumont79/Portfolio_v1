<img 
    src="/assets/blog-post/multi-tenant.avif" 
    alt="Une image bannière qui représente le titre de cet article qui traite du multi-tenant dans Symfony"
    class="mx-auto rounded-lg shadow-lg mb-8"
/>

# Implémenter une Architecture Multi-Tenant dans Symfony

Le multi-tenancy est un pattern architectural crucial pour les applications SaaS où une seule instance d'application sert plusieurs clients (tenants) tout en gardant leurs données isolées et sécurisées. Dans ce guide complet, nous allons explorer comment implémenter le multi-tenancy dans les applications Symfony.

## Qu'est-ce que le Multi-Tenancy ?

Le multi-tenancy est une architecture où une seule instance d'une application logicielle sert plusieurs tenants. Chaque tenant est un groupe d'utilisateurs qui partagent un accès commun avec des privilèges spécifiques à l'instance logicielle. Le principe clé est **l'isolation des données** garantissant que chaque tenant ne peut accéder qu'à ses propres données.

### Types de Multi-Tenancy

1. **Base de données unique, schéma partagé** : Tous les tenants partagent la même base de données et les mêmes tables avec une colonne d'identifiant de tenant
2. **Base de données unique, schémas séparés** : Chaque tenant a son propre schéma dans la même base de données
3. **Bases de données séparées** : Chaque tenant a sa propre base de données dédiée, ce que nous allons aborder dans cet article.

## Pourquoi le Multi-Tenancy dans Symfony ?

- **Efficacité des coûts** : L'infrastructure partagée réduit les coûts opérationnels
- **Évolutivité** : Plus facile de faire évoluer une seule instance d'application
- **Maintenance** : Les mises à jour et corrections de bugs s'appliquent à tous les tenants simultanément
- **Optimisation des ressources** : Meilleure utilisation des ressources entre les tenants

### Bundle Hakam Multi Tenancy : Un Bundle qui Fait la Différence 🔥

La façon la plus simple de l'implémenter est d'utiliser le [Bundle Multi-tenancy](https://github.com/RamyHakam/multi_tenancy_bundle) créé par **RamyHakam**. Dans cet article, nous allons utiliser ce bundle pour mettre en place notre architecture.

## 📖 Introduction

Créons une application de gestion médicale. L'objectif est de comprendre le concept de séparation des données par tenant tout en maintenant une sécurité robuste.

### 🏗️ Architecture

L'application suit une architecture multi-tenant avec **base de données séparée par tenant** :

- **Base de données principale** : Contient les utilisateurs, établissements et configuration des tenants
- **Bases de données des tenants** : Une base de données par établissement médical contenant les patients

## 🚀 Configuration de Base

### Prérequis

- PHP 8.2
- Composer
- Symfony CLI
- Base de données (MySQL/PostgreSQL)

### Créons le Projet

```bash
symfony new medical-app
```

### Variables d'Environnement

Configurez le fichier `.env` :

```bash
# Base de données principale
DATABASE_URL="mysql://user:password@127.0.0.1:3306/medical-app?serverVersion=8.0.32&charset=utf8mb4"
```

## 📦 Dépendances

### Installation des Bundles Requis

Installez les bundles principaux nécessaires pour le multi-tenancy :

```bash
# Core bundles
composer require doctrine/orm symfony/security-bundle api-platform/core lexik/jwt-authentication-bundle nelmio/cors-bundle

# Multi-tenancy bundle
composer require hakam/multi-tenancy-bundle
```

### Dépendances de Développement

```bash
# Development tools
composer require --dev symfony/maker-bundle symfony/web-profiler-bundle doctrine/doctrine-fixtures-bundle phpunit/phpunit
```

### Enregistrement des Bundles

Les bundles devraient être automatiquement enregistrés dans `config/bundles.php` :

```php
<?php

return [
    // ... other bundles
    Doctrine\Bundle\DoctrineBundle\DoctrineBundle::class => ['all' => true],
    Symfony\Bundle\SecurityBundle\SecurityBundle::class => ['all' => true],
    ApiPlatform\Symfony\Bundle\ApiPlatformBundle::class => ['all' => true],
    Lexik\Bundle\JWTAuthenticationBundle\LexikJWTAuthenticationBundle::class => ['all' => true],
    Nelmio\CorsBundle\NelmioCorsBundle::class => ['all' => true],
    Hakam\MultiTenancyBundle\HakamMultiTenancyBundle::class => ['all' => true],
];
```

## 🔧 Configuration Étape par Étape

### Configuration du Bundle Multi-Tenancy

D'abord, configurez le bundle Hakam Multi-Tenancy dans `config/packages/hakam_multi_tenancy.yaml` :

```yaml
hakam_multi_tenancy:
  # Main database connection (for users, establishments, tenant configs)
  main_connection: "default"

  # Tenant database configuration
  tenant:
    # Directory where tenant entity mappings are stored
    entity_manager_name: "tenant"

    # Tenant entity namespace
    entity_namespace: 'App\Entity\Tenant'

    # Database configuration for tenants
    database:
      driver: "pdo_mysql"
      charset: "utf8mb4"
      server_version: "8.0.32"

  # Security configuration
  security:
    # Automatic tenant switching based on user context
    auto_switch: true

    # Tenant resolver service (optional custom implementation)
    tenant_resolver: null
```

### Configuration Doctrine

Mettez à jour `config/packages/doctrine.yaml` pour supporter plusieurs gestionnaires d'entités :

```yaml
doctrine:
  dbal:
    default_connection: default
    connections:
      default:
        url: "%env(resolve:DATABASE_URL)%"
        driver: "pdo_mysql"
        server_version: "8.0.32"
        charset: utf8mb4

  orm:
    auto_generate_proxy_classes: true
    default_entity_manager: default
    entity_managers:
      default:
        connection: default
        mappings:
          Main:
            is_bundle: false
            dir: "%kernel.project_dir%/src/Entity/Main"
            prefix: 'App\Entity\Main'
            alias: Main
      tenant:
        connection: tenant
        mappings:
          Tenant:
            is_bundle: false
            dir: "%kernel.project_dir%/src/Entity/Tenant"
            prefix: 'App\Entity\Tenant'
            alias: Tenant
```

Maintenant implémentons les entités principales :

### 1. 👤 Configuration Utilisateur

#### Créer l'Entité Utilisateur

```bash
symfony console make:user
```

L'entité `User` contient :

- `email` : Identifiant unique
- `password` : Mot de passe haché
- `roles` : Rôles de sécurité
- `establishments` : Relation avec les établissements

Nous ajoutons des **Assert** pour protéger l'entité, voici le code :

```php
<?php

namespace App\Entity\Main;

use App\Repository\Main\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    #[Assert\Regex(pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character')]
    private ?string $password = null;

    /**
     * @var Collection<int, Establishment>
     */
    #[ORM\OneToMany(targetEntity: Establishment::class, mappedBy: 'user')]
    private Collection $establishments;

    public function __construct()
    {
        $this->establishments = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
            return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection<int, Establishment>
     */
    public function getEstablishments(): Collection
    {
        return $this->establishments;
    }

    public function addEstablishment(Establishment $establishment): static
    {
        if (!$this->establishments->contains($establishment)) {
            $this->establishments->add($establishment);
            $establishment->setUser($this);
        }

        return $this;
    }

    public function removeEstablishment(Establishment $establishment): static
    {
        if ($this->establishments->removeElement($establishment)) {
            if ($establishment->getUser() === $this) {
                $establishment->setUser(null);
            }
        }

        return $this;
    }
}
```

### 2. 🏠 Entité Établissement

Chaque **Establishment** sera un tenant unique. Voici l'entité Establishment :

```php
<?php

namespace App\Entity\Main;

use App\Repository\Main\EstablishmentRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EstablishmentRepository::class)]
#[ApiResource]
class Establishment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Establishment name is required')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Establishment name must be at least {{ limit }} characters long',
        maxMessage: 'Establishment name cannot be longer than {{ limit }} characters'
    )]
    private ?string $name = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Tenant ID is required')]
    #[Assert\Positive(message: 'Tenant ID must be a positive integer')]
    private ?int $tenantId = null;

    #[ORM\Column(length: 500)]
    #[Assert\NotBlank(message: 'Address is required')]
    #[Assert\Length(
        min: 5,
        max: 500,
        minMessage: 'Address must be at least {{ limit }} characters long',
        maxMessage: 'Address cannot be longer than {{ limit }} characters'
    )]
    private ?string $address = null;

    #[ORM\ManyToOne(inversedBy: 'establishments')]
    #[Assert\NotNull(message: 'User is required')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getTenantId(): ?int
    {
        return $this->tenantId;
    }

    public function setTenantId(int $tenantId): static
    {
        $this->tenantId = $tenantId;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
```

#### Migration de la Base de Données Principale

```bash
symfony console make:migration
symfony console doctrine:migration:migrate
```

> ⚠️ **Important** : Vérifiez votre configuration `.env` avant d'exécuter les migrations

### 2. 🏢 Configuration Multi-Tenant

#### Structure des Entités

Le projet utilise une séparation claire entre les entités :

```
src/Entity/
├── Main/           # Entités globales (base de données principale)
│   ├── User.php
│   ├── Establishment.php
│   └── TenantDbConfig.php
└── Tenant/         # Entités tenant (bases de données séparées)
    └── Patient.php
```

Pour configurer le Tenant, vous devez fournir une entité TenantDbConfig basée sur la documentation du Bundle :

#### Entité TenantDbConfig

L'entité `TenantDbConfig` stocke la configuration de base de données pour chaque tenant :

```php
<?php

namespace App\Entity\Main;

use App\Repository\Main\TenantDbConfigRepository;
use Doctrine\ORM\Mapping as ORM;
use Hakam\MultiTenancyBundle\Services\TenantDbConfigurationInterface;
use Hakam\MultiTenancyBundle\Traits\TenantDbConfigTrait;

#[ORM\Entity(repositoryClass: TenantDbConfigRepository::class)]
class TenantDbConfig implements TenantDbConfigurationInterface
{
    use TenantDbConfigTrait;
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}
```

#### Entité Patient (Tenant)

L'entité `Patient` implémente `TenantEntityInterface` et contient :

- `firstName` : Prénom du patient
- `lastName` : Nom de famille
- `nir` : Numéro de sécurité sociale (15 chiffres)
- `birthDate` : Date de naissance

```php
<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\PatientRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Hakam\MultiTenancyBundle\Entity\TenantEntityInterface;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PatientRepository::class)]
#[ApiResource]
class Patient implements TenantEntityInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'First name is required')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'First name must be at least {{ limit }} characters long',
        maxMessage: 'First name cannot be longer than {{ limit }} characters'
    )]
    private ?string $firstName = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Last name is required')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Last name must be at least {{ limit }} characters long',
        maxMessage: 'Last name cannot be longer than {{ limit }} characters'
    )]
    private ?string $lastName = null;

    #[ORM\Column(length: 15, unique: true)]
    #[Assert\NotBlank(message: 'NIR (Social Security Number) is required')]
    #[Assert\Length(exactly: 15, exactMessage: 'NIR must be exactly {{ limit }} characters long')]
    #[Assert\Regex(pattern: '/^[12][0-9]{14}$/', message: 'NIR format is invalid')]
    private ?string $nir = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotNull(message: 'Birth date is required')]
    #[Assert\LessThan('today', message: 'Birth date must be in the past')]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column]
    private ?int $tenantId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getNir(): ?string
    {
        return $this->nir;
    }

    public function setNir(string $nir): static
    {
        $this->nir = $nir;
        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getTenantId(): ?int
    {
        return $this->tenantId;
    }

    public function setTenantId(int $tenantId): static
    {
        $this->tenantId = $tenantId;
        return $this;
    }

    public function getFullName(): string
    {
        return $this->firstName . ' ' . $this->lastName;
    }
}
```

### 3. 📊 Fixtures et Données de Test

#### Structure des Fixtures

```
src/DataFixtures/
├── Main/
│   ├── UserFixtures.php          # Utilisateurs et admin
│   ├── EstablishmentFixtures.php  # Établissements médicaux
│   └── TenantDbConfigFixtures.php # Configuration tenant
└── Tenant/
    └── PatientFixtures.php        # Patients par tenant
```

### Implémentation des Fixtures Principales

#### Fixtures Utilisateur :

Nous pouvons implémenter la fixture utilisateur avec quelques utilisateurs :

```php
<?php

declare(strict_types=1);

namespace App\DataFixtures\Main;

use App\Entity\Main\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;

class UserFixtures extends Fixture implements FixtureGroupInterface
{
    private UserPasswordHasherInterface $passwordHasher;
    public const USER_REFERENCE = 'user_';
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    private $users = [
        [
            'password' => 'Password123!',
            'email' => 'john@icloud.com',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'Test123!',
            'email' => 'sarah@gmail.com',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'Toto123!',
            'email' => 'mike@yahoo.com',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'Titi123!',
            'email' => 'emma@hotmail.com',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'Tata123!',
            'email' => 'alex@outlook.com',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'Tutu123!',
            'email' => 'lucas@protonmail.com',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'Power123!',
            'email' => 'sophie@wanadoo.fr',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'PowerTest123!',
            'email' => 'daniel@free.fr',
            'roles' => ['ROLE_USER'],
        ],
        [
            'password' => 'SuperAdmin123!',
            'email' => 'admin@myapp.com',
            'roles' => ['ROLE_ADMIN'],
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach ($this->users as $index => $userData) {
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setRoles($userData['roles']);

            $hashedPassword = $this->passwordHasher->hashPassword($user, $userData['password']);
            $user->setPassword($hashedPassword);

            $this->addReference(self::USER_REFERENCE . ($index + 1), $user);

            $manager->persist($user);
        }
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return [
            'main',
        ];
    }
}
```

#### Fixtures Tenant :

Cette fixture est le point clé, nous allons créer les tenants grâce aux données fournies dans cette fixture.

```php
<?php

declare(strict_types=1);

namespace App\DataFixtures\Main;

use App\Entity\Main\TenantDbConfig;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Hakam\MultiTenancyBundle\Enum\DatabaseStatusEnum;
use Hakam\MultiTenancyBundle\Enum\DriverTypeEnum;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;

class TenantDbConfigFixtures extends Fixture implements FixtureGroupInterface
{
    private $tenantConfigs = [
        1 => [
            'dbName' => 'cabinet1',
            'dbUsername' => 'root',
            'dbHost' => '127.0.0.1',
            'dbPort' => '3306',
            'dbPassword' => '',
        ],
        2 => [
            'dbName' => 'cabinet2',
            'dbUsername' => 'root',
            'dbHost' => '127.0.0.1',
            'dbPassword' => '',
            'dbPort' => '3306',
        ],
        3 => [
            'dbName' => 'cabinet3',
            'dbUsername' => 'root',
            'dbHost' => '127.0.0.1',
            'dbPassword' => '',
            'dbPort' => '3306',
        ],
        4 => [
            'dbName' => 'cabinet4',
            'dbUsername' => 'root',
            'dbPassword' => '',
            'dbHost' => '127.0.0.1',
            'dbPort' => '3306',
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        foreach ($this->tenantConfigs as $key => $tenantConfig) {
            $newTenant = new TenantDbConfig();
            $newTenant->setDbName($tenantConfig['dbName']);
            $newTenant->setDbUserName($tenantConfig['dbUsername']);
            $newTenant->setDbHost($tenantConfig['dbHost']);
            $newTenant->setDbPort($tenantConfig['dbPort']);
            $newTenant->setDbPassword($tenantConfig['dbPassword']);
            $newTenant->setDriverType(DriverTypeEnum::MYSQL);
            $newTenant->setDatabaseStatus(DatabaseStatusEnum::DATABASE_NOT_CREATED); // it will be switched to DATABASE_CREATED when we will execute the command
            $manager->persist($newTenant);
        }
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['main'];
    }
}
```

#### Fixture Établissement :

Et enfin pour les fixtures principales, nous implémentons la fixture établissement qui est liée à l'entité User :

```php
<?php

declare(strict_types=1);

namespace App\DataFixtures\Main;

use App\Entity\Main\Establishment;
use App\Entity\Main\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class EstablishmentFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface
{
    public const ESTABLISHMENT_REFERENCE = 'establishment_';
    private $establishments = [
        [
            'name' => 'Cabinet Médical Pasteur',
            'tenantId' => 1,
            'address' => '123 Rue Pasteur, 75015 Paris, France',
            'userIds' => [4],
        ],
        [
            'name' => 'Clinique Saint-Antoine',
            'tenantId' => 2,
            'address' => '456 Avenue Saint-Antoine, 75004 Paris, France',
            'userIds' => [5],
        ],
        [
            'name' => 'Centre Médical République',
            'tenantId' => 3,
            'address' => '789 Place de la République, 75003 Paris, France',
            'userIds' => [6],
        ],
        [
            'name' => 'Polyclinique Montparnasse',
            'tenantId' => 4,
            'address' => '101 Boulevard Montparnasse, 75014 Paris, France',
            'userIds' => [8],
        ],
    ];
    public function load(ObjectManager $manager): void
    {
        foreach ($this->establishments as $index => $establishment) {
            $newEstablishment = new Establishment();
            $newEstablishment->setName($establishment['name']);
            $newEstablishment->setTenantId($establishment['tenantId']);
            $newEstablishment->setAddress($establishment['address']);

            foreach ($establishment['userIds'] as $userId) {
                $user = $this->getReference(UserFixtures::USER_REFERENCE . $userId, User::class);
                $user->addEstablishment($newEstablishment);
            }

            $this->addReference(self::ESTABLISHMENT_REFERENCE . ($index + 1), $newEstablishment);
            $manager->persist($newEstablishment);
        }
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['main'];
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
```

#### Chargement des Fixtures Principales

```bash
symfony console doctrine:fixtures:load -n --group=main
```

Vérifions les données que nous avons dans les bases de données :

#### Pour l'Utilisateur :

```sql

mysql> select * from user;
+----+----------------------+----------------+--------------------------------------------------------------+
| id | email                | roles          | password                                                     |
+----+----------------------+----------------+--------------------------------------------------------------+
| 28 | john@icloud.com      | ["ROLE_USER"]  | $2y$13$Dn70RQoOjakCHTsgxfGeseD/Q1etbyPBPH5/0R9qAYGceUZa/nmYm |
| 29 | sarah@gmail.com      | ["ROLE_USER"]  | $2y$13$6Q2cuEzTY.aeAz2i8IK6Ie/Ju87JONRRfR0R3goCGudnObGuP5Ooe |
| 30 | mike@yahoo.com       | ["ROLE_USER"]  | $2y$13$Vl2DXONnP9FR.GhFeuI1Qe4avwPYTWGm3v0Lpolp7a.M7GHctOMAK |
| 31 | emma@hotmail.com     | ["ROLE_USER"]  | $2y$13$Q8s62rQa.xQ16JDQA9s97OIB.967Wo988.3Bp093R8VzH81jUeJ6C |
| 32 | alex@outlook.com     | ["ROLE_USER"]  | $2y$13$xKp3ytRGDfyh7kiui5949.xv5AnyHyXJMFD7Hqbpwvav.kGv6ehvK |
| 33 | lucas@protonmail.com | ["ROLE_USER"]  | $2y$13$jU2dz1.Kb66BrxuCsK4L9Omv9UZgUnL8CG/bY/BU0dOJXi9JtBqJm |
| 34 | sophie@wanadoo.fr    | ["ROLE_USER"]  | $2y$13$Sy2NExwJ6hmpSZYOupEyNeks/Y9n2VZOa/Sog6H6lC1RkARlW42rW |
| 35 | daniel@free.fr       | ["ROLE_USER"]  | $2y$13$mJRzNzrybdpNErTY5uovAeEkTxeYK2SPFwmREdUEGDn3Yo3niOnj6 |
| 36 | admin@myapp.com      | ["ROLE_ADMIN"] | $2y$13$BP0f1WhGKbqr1lytFPrYwOq0o85NpfRv5DocBlwvBZcyE7l295yqS |
+----+----------------------+----------------+--------------------------------------------------------------+
```

#### Pour la Configuration Tenant Db :

```sql
mysql> select * from tenantDbConfig;
+----+----------+------------+------------+------------+-----------+--------+----------------------+
| id | dbName   | driverType | dbUserName | dbPassword | dbHost    | dbPort | databaseStatus       |
+----+----------+------------+------------+------------+-----------+--------+----------------------+
| 13 | cabinet1 | mysql      | root       |            | 127.0.0.1 | 3306   | DATABASE_NOT_CREATED |
| 14 | cabinet2 | mysql      | root       |            | 127.0.0.1 | 3306   | DATABASE_NOT_CREATED |
| 15 | cabinet3 | mysql      | root       |            | 127.0.0.1 | 3306   | DATABASE_NOT_CREATED |
| 16 | cabinet4 | mysql      | root       |            | 127.0.0.1 | 3306   | DATABASE_NOT_CREATED |
+----+----------+------------+------------+------------+-----------+--------+----------------------+
4 rows in set (0,01 sec)
```

#### Pour l'Établissement :

```sql

mysql> select * from Establishment;
+----+---------+-----------------------------+----------+--------------------------------------------------+
| id | user_id | name                        | tenantId | address                                          |
+----+---------+-----------------------------+----------+--------------------------------------------------+
|  1 |      31 | Cabinet Médical Pasteur     |        1 | 123 Rue Pasteur, 75015 Paris, France             |
|  2 |      32 | Clinique Saint-Antoine      |        2 | 456 Avenue Saint-Antoine, 75004 Paris, France    |
|  3 |      33 | Centre Médical République   |        3 | 789 Place de la République, 75003 Paris, France  |
|  4 |      35 | Polyclinique Montparnasse   |        4 | 101 Boulevard Montparnasse, 75014 Paris, France  |
+----+---------+-----------------------------+----------+--------------------------------------------------+
4 rows in set (0,00 sec)
```

Parfait, maintenant que nous avons nos données, nous pouvons créer notre tenant.

### Implémentation des Fixtures Tenant

#### Fixture Patient :

Pour charger la fixture tenant, nous devons définir **#[TenantFixture]** en utilisant :

```php
<?php use Hakam\MultiTenancyBundle\Attribute\TenantFixture;
```

C'est fourni par le bundle.

```php

<?php

namespace App\DataFixtures\Tenant;

use Hakam\MultiTenancyBundle\Attribute\TenantFixture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Tenant\Patient;

#[TenantFixture]
class PatientFixtures extends Fixture
{

    private $patients = [
        [
            'firstName' => 'John',
            'lastName' => 'Pers',
            'nir' => '110122323454252',
            'birthDate' => '1997-10-15',
        ],
        [
            'firstName' => 'Emma',
            'lastName' => 'Durand',
            'nir' => '290155789654321',
            'birthDate' => '1991-05-03',
        ],
        [
            'firstName' => 'Lucas',
            'lastName' => 'Martin',
            'nir' => '190178456321987',
            'birthDate' => '1999-11-10',
        ],
        [
            'firstName' => 'Sophie',
            'lastName' => 'Bernard',
            'nir' => '280145632198745',
            'birthDate' => '1924-07-17',
        ],
        [
            'firstName' => 'Daniel',
            'lastName' => 'Petit',
            'nir' => '180165987321654',
            'birthDate' => '1985-01-04',
        ],
        [
            'firstName' => 'Clara',
            'lastName' => 'Roux',
            'nir' => '290188654987321',
            'birthDate' => '1994-04-04',
        ],
        [
            'firstName' => 'Maxime',
            'lastName' => 'Girard',
            'nir' => '190165478963258',
            'birthDate' => '1993-09-02',
        ],
        [
            'firstName' => 'Laura',
            'lastName' => 'Dupuis',
            'nir' => '290175896321478',
            'birthDate' => '1996-12-25',
        ],
        [
            'firstName' => 'Antoine',
            'lastName' => 'Morel',
            'nir' => '180154789632145',
            'birthDate' => '1991-02-01',
        ],
        [
            'firstName' => 'Camille',
            'lastName' => 'Faure',
            'nir' => '290168745963214',
            'birthDate' => '1994-08-05',
        ],
        [
            'firstName' => 'Julien',
            'lastName' => 'Mercier',
            'nir' => '190198745632589',
            'birthDate' => '1989-06-10',
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < count($this->patients); $i++) {
            $newPatient = new Patient();
            $newPatient->setFirstName($this->patients[$i]['firstName']);
            $newPatient->setLastName($this->patients[$i]['lastName']);
            $newPatient->setNir($this->patients[$i]['nir']);
            $newPatient->setBirthDate(new \DateTime($this->patients[$i]['birthDate']));
            $manager->persist($newPatient);
        }
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['tenant'];
    }
}
```

### 4. 🗄️ Gestion des Bases de Données Tenant

#### Création des Bases de Données Tenant

```bash
symfony console tenant:database:create
```

#### Génération des Migrations Tenant

```bash
# Generate migration based on the tenant ID 1
symfony console tenant:migration:diff 1
```

#### Application des Migrations

```bash
# Initial migration with interactive assistant
symfony console tenant:migration:migrate init
```

#### Chargement des Fixtures

Par défaut si vous tapez :

```bash
symfony console tenant:fixtures:load -n
```

Cela chargera la fixture dans la première base de données tenant. Vous pouvez spécifier l'id du tenant dans lequel vous voulez insérer vos fixtures comme ceci :

```bash
symfony console tenant:fixtures:load 2 -n
```

Et vous obtenez ce résultat :

```sql
mysql> use cabinet2;
Database changed
```

```sql
mysql> select * from patient;
+----+------------+-----------+-----------------+------------+
| id | first_name | last_name | nir             | birth_date |
+----+------------+-----------+-----------------+------------+
|  1 | John       | Pers      | 110122323454252 | 1997-10-15 |
|  2 | Emma       | Durand    | 290155789654321 | 1991-05-03 |
|  3 | Lucas      | Martin    | 190178456321987 | 1999-11-10 |
|  4 | Sophie     | Bernard   | 280145632198745 | 1924-07-17 |
|  5 | Daniel     | Petit     | 180165987321654 | 1985-01-04 |
|  6 | Clara      | Roux      | 290188654987321 | 1994-04-04 |
|  7 | Maxime     | Girard    | 190165478963258 | 1993-09-02 |
|  8 | Laura      | Dupuis    | 290175896321478 | 1996-12-25 |
|  9 | Antoine    | Morel     | 180154789632145 | 1991-02-01 |
| 10 | Camille    | Faure     | 290168745963214 | 1994-08-05 |
| 11 | Julien     | Mercier   | 190198745632589 | 1989-06-10 |
+----+------------+-----------+-----------------+------------+
11 rows in set (0,00 sec)

```

## Service de Changement de Tenant

Maintenant que nous avons configuré nos entités Main et Tenant, créé notre tenant et chargé toutes les fixtures. Nous pouvons implémenter un nouveau service qui basculera vers un tenant spécifique.

Dans cet exemple, je mets l'id du tenant comme argument de la méthode switch tenant, mais je recommande de le passer dans l'en-tête comme **X-Tenant-Id**.

Le `TenantSwitchService` gère :

- Vérification des droits d'accès
- Changement de base de données
- Sécurité au niveau tenant

```php
<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Main\User;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Hakam\MultiTenancyBundle\Event\SwitchDbEvent;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class TenantSwitchService
{
    public function __construct(
        private TenantEntityManager $tenantEntityManager,
        private EventDispatcherInterface $eventDispatcher,
        private Security $security
    ) {}

    public function switchTenant(int $tenantId): void
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new \Exception('User must be logged in to switch tenant');
        }

        if (!$this->userHasAccessToTenant($user, $tenantId)) {
            throw new \Exception('Failed to switch tenant: User does not have access to this tenant or tenant not found: ' . $tenantId);
        }

        // Dispatch event to switch database context
        $this->eventDispatcher->dispatch(new SwitchDbEvent($tenantId));
    }

    private function userHasAccessToTenant(User $user, int $tenantId): bool
    {
        foreach ($user->getEstablishments() as $establishment) {
            if ($establishment->getTenantId() === $tenantId) {
                return true;
            }
        }

        return false;
    }

    public function getCurrentTenantId(): ?int
    {
        return $this->tenantEntityManager->getCurrentTenantId();
    }

    public function getUserAccessibleTenants(User $user): array
    {
        $tenantIds = [];
        foreach ($user->getEstablishments() as $establishment) {
            $tenantIds[] = $establishment->getTenantId();
        }

        return $tenantIds;
    }
}

```

### Contrôle d'Accès Tenant

- Chaque utilisateur n'a accès qu'à ses établissements
- Vérification automatique des droits lors du changement de tenant
- Isolation complète des données entre tenants
- Vous pouvez appeler ce service dans un contrôleur

Une autre méthode serait d'implémenter un **EventListener** qui pourrait écouter les requêtes HTTP, vérifier l'en-tête et basculer vers le bon tenant basé sur le **X-Tenant-Id** fourni.

## 🧪 Tests

### Structure des Tests

```
tests/
├── bootstrap.php
└── Service/
    └── TenantSwitchTest.php
```

```php
<?php

namespace App\Tests\Service;

use PHPUnit\Framework\TestCase;
use App\Service\TenantSwitchService;
use App\Entity\Main\User;
use App\Entity\Main\Establishment;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Symfony\Bundle\SecurityBundle\Security;

class TenantSwitchTest extends TestCase
{
    public function testSwitchTenantSuccess()
    {
        $tenantEntityManager = $this->createMock(TenantEntityManager::class);
        $eventDispatcher = $this->createMock(EventDispatcherInterface::class);
        $security = $this->createMock(Security::class);

        $user = new User();
        $establishment = new Establishment();
        $establishment->setTenantId(1);
        $user->addEstablishment($establishment);

        $security->expects($this->once())
            ->method('getUser')
            ->willReturn($user);

        $eventDispatcher->expects($this->once())
            ->method('dispatch');

        $tenantSwitch = new TenantSwitchService($tenantEntityManager, $eventDispatcher, $security);

        // This should not throw an exception
        $tenantSwitch->switchTenant(1);

        // If we reach here, the test passed
        $this->expectNotToPerformAssertions();
    }

    public function testSwitchTenantNoAccess()
    {
        $tenantEntityManager = $this->createMock(TenantEntityManager::class);
        $eventDispatcher = $this->createMock(EventDispatcherInterface::class);
        $security = $this->createMock(Security::class);

        $user = new User();
        $establishment = new Establishment();
        $establishment->setTenantId(2);
        $user->addEstablishment($establishment);

        $security->expects($this->once())
            ->method('getUser')
            ->willReturn($user);

        $tenantSwitch = new TenantSwitchService($tenantEntityManager, $eventDispatcher, $security);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Failed to switch tenant: User does not have access to this tenant or tenant not found: 1');

        $tenantSwitch->switchTenant(1);
    }

    public function testSwitchTenantUnexistingTenant()
    {
        $tenantEntityManager = $this->createMock(TenantEntityManager::class);
        $eventDispatcher = $this->createMock(EventDispatcherInterface::class);
        $security = $this->createMock(Security::class);

        $user = new User();
        $establishment = new Establishment();
        $establishment->setTenantId(2);
        $user->addEstablishment($establishment);

        $security->expects($this->once())
            ->method('getUser')
            ->willReturn($user);

        $tenantSwitch = new TenantSwitchService($tenantEntityManager, $eventDispatcher, $security);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Failed to switch tenant: User does not have access to this tenant or tenant not found: 999');

        $tenantSwitch->switchTenant(999);
    }
}
```

### Exécuter les Tests

```bash
# Unit tests
./vendor/bin/phpunit

```

## 📁 Structure du Projet

```
medical-app/
├── config/
│   ├── bundles.php
│   ├── packages/           # Configuration des bundles
│   ├── routes/            # Configuration de routage
│   └── services.yaml      # Configuration des services
├── migrations/
│   ├── Main/             # Migrations base de données principale
│   └── Tenant/           # Migrations base de données tenant
├── src/
│   ├── Controller/       # Contrôleurs API et Web
│   ├── Entity/
│   │   ├── Main/        # Entités globales
│   │   └── Tenant/      # Entités tenant
│   ├── Repository/      # Repositories Doctrine
│   ├── Service/         # Services métier
│   └── DataFixtures/    # Données de test
├── templates/           # Templates Twig
└── tests/              # Tests automatisés
```

## 🎯 Conclusion

L'implémentation du multi-tenancy dans Symfony en utilisant le Bundle Hakam Multi-Tenancy fournit une base robuste pour les applications SaaS. L'approche de bases de données séparées offre :

- **Forte isolation des données** entre tenants
- **Options d'évolutivité flexibles** par tenant
- **Sécurité renforcée** grâce à la séparation physique
- **Conformité simplifiée** avec les réglementations de protection des données

Bien que cette approche nécessite plus de gestion d'infrastructure, elle fournit le plus haut niveau d'isolation des tenants et est idéale pour les applications traitant des données sensibles ou nécessitant des normes de conformité strictes.

La clé du succès est une planification appropriée de votre architecture tenant, des tests approfondis des mécanismes de changement de tenant, et l'implémentation de stratégies complètes de surveillance et de sauvegarde pour les déploiements en production.
