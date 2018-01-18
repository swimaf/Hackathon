# Projet Qwant du Hackathon 2018

## INSTALLATION

Prérequis: Nodejs LTS v.8.9.x

1) Télécharger le dossier
2) Dézipper le dossier
3) Taper en ligne de commande dans le dossier du projet : npm install
4) Installer ffmpeg
5) Taper en ligne de commande npm install -g ytdl
6) Créer les sous-dossiers : scloud-dls, dls et vim-dls dans le dossier du projet

## UTILISATION

Taper dans le dossier du projet : node serveur.js avec les droits d'admin de préférence
Ouvrir le navigateur à l'adresse : 127.0.0.1:3000

## DESCRIPTION DES FICHIERS IMPORTANTS

 - serveur.js : fichier de serveur ExpressJS qui gère le rendu de la page de l'application, les recherches sur les différentes plateformes de contenu multimédia,
   ainsi que l'enregistrement, la conversion, et le transfert des fichiers demandés

 - soundcloud-dl.js : module permettant la recherche et le téléchargement de contenu multimédia sur la plateforme SoundCloud

 - vimeo-dl.js : module permettant la recherche et le téléchargement de contenu multimédia sur la plateforme Viméo

 - views/accueil.ejs : page de vue ejs (moteur de rendu utilisé) basée sur le framework CSS Bulma  permettant de définir l'interface de l'application

 ## LICENCE

 Les différents modules externes utilisés ont été récupérés via le gestionnaire de paquets NPM. Les modules de cette plateforme sont sous licences libres de type : GNU GPL ou MIT

 Les différents webservices proposés par les plateformes multimédia avec lesquelles intéragit notre application sont basés sur des licences propriétaires personnalisées

 Notre code a été rédigé dans le cadre du hackathon de Janvier 2018 organisé par l'Université de Corse, nous ne le considérons pas comme libre.

 Copyright (C) DOMContentLoaded Team - All Rights Reserved
 Unauthorized copying of this file, via any medium is strictly prohibited
 Proprietary and confidential
 Written by Jean-Pierre Jouault-Bonardi <jouault.jpierre@outlook.com>, Etienne Martinet <e.martinet0@gmail.com>, Antoine Dominici <dominici.antoine.p@gmail.com>, January 2018
