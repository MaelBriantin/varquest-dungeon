//_________________________________________PARAMETRES____________________________________________________//

let answer = document.getElementById("answer");
let question = document.getElementById("question");
let header = document.getElementById("header");
let classe = document.getElementById("classe");
let items = document.getElementById("items");
let vie = document.getElementById("vie");
let container = document.getElementById("main");
let classDisplay = document.getElementById("menu");
let nameClass = document.getElementById("nameClass");
let animation = document.getElementById("animation");
let start = document.getElementById("start");
let commencer = document.getElementById("commencer");
let control = document.getElementById("control");
let time = 0;

let aventurier = {
    "classe": "",
    "vie": [0,0,0],
    "inventaire": [],
    "parcours" : [],
}

let clock = "";
let themeSong = "";

let ecrase = "Vous n'avez pas résolu l'énigme à temps. Vous avez été écrasé par le plafond piégé.";

//animation.classList.add("none");

start.addEventListener("click", function(){
    commencer.classList.toggle("none");
    init();
});

//init();

//_________________________________________FONCTIONS DE BASES____________________________________________________//

//fonction timer avant mort.
function timer(n, text){
    let temp = n;
    setInterval(function(){
        if (temp>0){
            temp -= 1;
        //console.log(temp);
        if (temp===0){
            answer.innerHTML = "";
            question.innerHTML = text;
            createButton("Continuer", "Continuer", "continuer", function(){
                pertePV(3);
            });
        }
        animation.innerHTML = temp;
        animation.classList.add("timer");
        }
    }, 1000);
}

//fonction de création de bouton
function createButton (text, id, className, onclick) {
    let button = document.createElement("button");
    answer.appendChild(button);
    button.type = "button";
    button.innerHTML = text;
    button.id = id;
    button.className = className;
    button.onclick = onclick;
    return button;
}


function song(title, volume, bool){
    control.volume = .5;
    setTimeout(function(){
        control.volume = 1;
    }, 2000);
    let sound = document.createElement("audio");
    sound.src = title;
    sound.autoplay = true;
    sound.volume = volume;
    if (bool === true){
        themeSong = sound;
        //console.log("réussi");
    } else {
        //console.log("pas de musique");
    }
}


//fonction qui permet de vérifier la présence d'un item dans l'inventaire
function checkItem(item){
    for (let i=0; i<aventurier.inventaire.length; i++){
        if (aventurier.inventaire[i] === item){
            return true;
        }
    }
    return false;
}
//fonction qui permet de vérifier le parcours du joueur
function checkParcours(parcours){
    for (let i=0; i<aventurier.parcours.length; i++){
        if (aventurier.parcours[i] === parcours){
            return true;
        } 
}
    return false;
}
//fonction qui vérifie la classe du joueur
function checkClasse(classe){
        if (aventurier.classe === classe){
            return true;
        } 
        return false;
    }
//gestion PV
function pertePV(n){
    for (let i=0; i<n; i++){
    aventurier.vie.pop();
    }
    let sound = document.createElement("audio");
    sound.src = "sound/wilhelm.mp3";
    sound.autoplay = true;
    sound.volume = .5;
    hud();
    checkDeath();
}
//+
function gainPV(n){
    for (let i=0; i<n; i++){
        aventurier.vie.push(0);
    }
    hud();
}
function checkDeath(){
    if (aventurier.vie.length<=0){
        themeSong.pause();
        //music
        let sound = document.createElement("audio");
        sound.src = "./sound/Game_Over_3.wav";
        sound.autoplay = true;
        sound.volume = 1;
        //music
        animation.innerHTML = "";
        answer.innerHTML = "";
        question.innerHTML = "<p style= 'color: red'>Vous êtes mort...</p>";
        header.classList.toggle("appear");
        createButton("Recommencer", "Recommencer", "answer__opt", function(){
            location.reload();
        },);
    }
}
//fonction d'affichage de l'HUD
function hud(){
    classe.innerHTML = "";
    vie.innerHTML = "";
    items.innerHTML = "";
    header.classList.add("appear");
    classe.innerHTML = aventurier.classe;
    for (let i=0; i<aventurier.vie.length; i++){
        let coeur = document.createElement("div");
        vie.appendChild(coeur);
        coeur.className = "coeur";
        coeur.innerHTML += "<img src='img/heart.png' alt='coeur'>";
    }
    for (let y=0; y<aventurier.inventaire.length; y++){
        let item = document.createElement("div");
        items.appendChild(item);
        item.innerHTML = aventurier.inventaire[y];
    }
}

//fonction d'ajout de classe dans le JSON
function ajoutClasse(className){
    aventurier.classe = className;
    // console.log(aventurier.classe);
    // console.log(aventurier);
    // console.log(className);
    hud();
}
//fonction d'ajout d'un élément dans l'inventaire
function ajoutItem(item){
    aventurier.inventaire.push(item);
    // console.log(aventurier.inventaire);
    hud();
}
function retraitItem(item){
    for (let i=0; i<aventurier.inventaire.length; i++){
        if (aventurier.inventaire[i] === item){
            aventurier.inventaire.splice(i, 1);
        }
    }
    hud();
}
//fonction qui permet de savoir où le joueur se situe dans le parcours de jeu
function ajoutParcours(parcours){
    aventurier.parcours.push(parcours);
    // console.log(aventurier.parcours);
}


//__________________________________________________CHOIX DE CLASSES_____________________________________________________________//
//creation de bouton pour le choix de la classe magicien
function classBtn(text, classe, question1, question2, item1, item2, img){
    createButton(text, classe, "answer__opt", function(){
        animation.classList.remove("none");
        ajoutParcours(classe);
        answer.innerHTML = "";
        question.innerHTML = question1;
        //image
        let image = document.createElement("img");
        image.src = img;
        image.className = "aventurier";
        animation.appendChild(image);
        //
        createButton("Oui", "oui", "answer__opt", function(){
            //control.pause();
            control.classList.toggle("none");
            let hit = document.createElement("audio");
                hit.src = "./sound/hit.mp3";
                hit.autoplay = true;
                hit.volume = .5;
            ajoutClasse(classe);
            answer.innerHTML = "";
            question.innerHTML = question2;
            ajoutItem(item1);
            ajoutItem(item2);
            hud();
            createButton("Continuer", "Continuer", "continuer", function(){
                song("./sound/door.mp3", .5, false);
                //music
                song("sound/dungeon.mp3", 1, true);
                //music
                premièreEnigme();
            });
        });
        createButton("Non", "non", "answer__opt", function(){
            animation.innerHTML = "";
            alorsQui();
        });
    });
}

//si pas le bon choix, on recommence
function alorsQui() {
    header.classList.remove("none");
    animation.classList.remove("none");
    answer.innerHTML = "";
    question.innerHTML = "Dans ce cas, qui êtes-vous ?";
    if (checkParcours("magicien") === true){
        classBtn("Magicien", "magicien", "Vous avez changé d'avis finalement ? Vous êtes bien un magicien ?", "Dans ce cas, entrez magicien !", "bâton de mage", "livre de sort", "./img/magicien.png");
    } else {
        classBtn("Un magicien", "magicien", "Un magicien c'est cela ?<br>Alors comme ça, vous êtes un adepte des arcanes magiques ?", "Dans ce cas, bienvenue dans ce donjon<br>Magicien !!", "bâton de mage", "livre de sort", "./img/magicien.png");
    }
    if (checkParcours("barbare") === true){
        classBtn("Un barbare", "barbare", "Vous avez changé d'avis finalement ? Vous êtes bien un barbare ?", "Dans ce cas, entrez barbare !!", "hache", "potion de vie", "img/barbare.png");
    } else {
        classBtn("Un barbare", "barbare", "Un barbare donc...<br>Votre truc, c'est les grosses haches qui tachent c'est ça ?", "Dans ce cas, bienvenue dans ce donjon<br>Barbare !!", "hache", "potion de vie", "img/barbare.png");
    }
    if (checkParcours("voleur") === true){
        classBtn("Un voleur", "voleur", "Vous avez changé d'avis finalement ? Vous êtes bien un voleur ?", "Dans ce cas, entrez voleur !!", "dagues", "crochets", "img/voleur.png");
    } else {
        classBtn("Un voleur", "voleur", "Un voleur.<br>Vile félon arpentant la nuit en quête de richesse.", "Dans ce cas, bienvenue dans ce donjon<br>Voleur !!", "dagues", "crochets", "img/voleur.png");
    }
    
}

//___________________________________________________INITIALISATION_____________________________________________________________//
//fonction qui déclenche le jeu
function init(){
    header.classList.remove("none");
    container.classList.remove("none");
    animation.classList.add("none");
    answer.innerHTML = "";
    question.innerHTML = "";
    question.innerHTML = "Après plusieurs jours et plusieurs nuits de marche dans le froid et sous la pluie, vous vous trouvez enfin devant l'entrée du donjon que vous recherchiez.<br>La gloire et la richesse tant désirées seront peut-être bientôt pour vous réalité !"
        createButton("Continuer", "Continuer", "continuer", function(){
            answer.innerHTML = "";
            question.innerHTML = "Vous faites désormais face à l'immense porte du donjon. Vous hotez enfin la capuche qui protégeait votre visage des intempéries. Alors, alors... Qui êtes-vous ?";
            classBtn("Un magicien", "magicien", "Un magicien c'est cela ?<br>Alors comme ça, vous êtes un adepte des arcanes magiques ?", "Dans ce cas, bienvenue dans ce donjon<br>Magicien !!", "bâton de mage", "livre de sort", "img/magicien.png");
            classBtn("Un barbare", "barbare", "Un barbare donc...<br>Votre truc, c'est les grosses haches qui tachent c'est ça ?", "Dans ce cas, bienvenue dans ce donjon<br>Barbare !!", "hache", "potion de vie", "img/barbare.png");
            classBtn("Un voleur", "voleur", "Un voleur.<br>Vile félon arpentant la nuit en quête de richesse.", "Dans ce cas, bienvenue dans ce donjon<br>Voleur !!", "dagues", "crochets", "img/voleur.png");
        });
}

//_______________________ENTREE_____________________________________________________________//
function premièreEnigme(){
    animation.classList.add("none");
    animation.innerHTML = "";
    answer.innerHTML = "";
    question.innerHTML = "Une fois la porte franchie (non sans faire grincer les gongs qui la retiennent), vous faites face à trois chemins possibles. L'absence de lumière vous empêche de voir ce qui se trouve au bout de ces chemins. ";
    createButton("Continuer", "Continuer", "continuer", function(){
        direction();
});
}

//__________________________________________________CHOIX DIRECTION_____________________________________________________________//
function direction(){
    answer.innerHTML = "";
    question.innerHTML = "Quelle direction allez-vous prendre ?";
        if (checkParcours("troll vaincu") === false){
            createButton("A gauche", "A gauche", "answer__opt", function(){
                    troll();
        });
        }  
        if (checkParcours("coffre cassé") == false){
            createButton("Tout droit", "Tout droit", "answer__opt", function(){
                answer.innerHTML = "";
                question.innerHTML = "Après avoir parcouru quelques mètres dans l'obscurité la plus totale, vous vous retrouvez face à un coffre fermé par un cadena robuste.";
                    coffre();
            });
        }   
        if (checkParcours("miroir brisé") === false){
            createButton("A droite", "A droite", "answer__opt", function(){
                answer.innerHTML = "";
                question.innerHTML = "Vous tatonnez dans le noir jusqu'à vous retrouver face à un étrange miroir.";
                createButton("Continuer", "Continuer", "continuer", function(){
                    miroirMagique();
                });
            });
        }
}

//_____________________________________________________________COFFRE_____________________________________________________________//
function coffre(){
        if ((checkItem("clef mystique") === true) && (checkParcours("clef essayée") === false)){
            createButton("Essayer la clef", "Essayer la clef", "answer__opt", function(){
                song("sound/Lock 1.wav", 1);
                answer.innerHTML = "";
                question.innerHTML = "Vous insérez la clef dans la serrure du coffre mais elle ne semble pas correspondre.";
                ajoutParcours("clef essayée");
                createButton("Continuer", "Continuer", "continuer", function(){
                    coffre();
                });
            });
        } else {
        if ((checkClasse("voleur") === true) && (checkItem("crochets") === true)){
            answer.innerHTML = "";
            createButton("Utiliser les crochets", "ouvrir", "answer__opt", function(){
                retraitItem("crochets");
                song("sound/Lock 3.wav", 1);
                answer.innerHTML = "";
                question.innerHTML = "Vous vous appliquez à manoeuvrer délicatement les crochets à l'intérieur de la serrure du coffre... Après quelques minutes d'intenses efforts, le coffre cède enfin à vos avances.";
                createButton("Continuer", "Continuer", "continuer", function(){
                    song("sound/Fanfare_1.wav", 1);
                    answer.innerHTML = "";
                    question.innerHTML = "A l'intérieur du coffre, vous trouvez une potion écarlate. Selon les standards imémoriaux de la fantasy, cette potion devrait vous permettre de regagner un peu de point de vie si consommée.";
                    createButton("Continuer", "Continuer", "continuer", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "Vous prenez la potion et la déposez au fond de votre besace.";
                        ajoutItem("potion de soin");
                        ajoutParcours("coffre cassé");
                        createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                            direction();
                        });
                    });
                });
            });
            createButton("Revenir à l'entrée", "Continuer", "answer__opt", function(){
                direction();
            });
        }
        if ((checkClasse("voleur") === true) && (checkItem("crochets") === false)){
            answer.innerHTML = "";
            question.innerHTML = "Bon et bien voilà... Vous êtes devant un coffre vérouillé, sans la clef et sans crochets. Soudaienement, vous n'êtes pas certain que les avoir utilisés un peu plus tôt ait été votre meilleure idée.";
            ajoutParcours("coffre cassé");
            createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                direction();
            });
        }
        //Magicien//
        if (checkClasse("magicien") === true){
            answer.innerHTML = "";
            createButton("Utiliser votre magie", "disparu", "answer__opt", function(){
                answer.innerHTML = "";
                question.innerHTML = "Vous lancez un sort en direction du coffre dans l'espoir de l'ouvrir par magie.";
                createButton("Continuer", "Continuer", "continuer", function(){
                    song("sound/thunder.mp3", 1);
                    container.classList.add('white__flash');
                    header.classList.add('none');
                    setTimeout(function(){
                        container.classList.remove('white__flash');
                        header.classList.remove('none');
                    }, 400);
                    answer.innerHTML = "";
                    question.innerHTML = "Ah... Il y a eu une lumière aveuglante, un bruit de tonnerre assourdissant, puis plus rien. Mais plus rien du tout. Plus de coffre non plus.";
                    createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                        ajoutParcours("coffre cassé");
                        direction();
                    });
                });
            });
        }
        //Barbare//
        if ((checkClasse("barbare") === true) && (checkItem("hache") === true)){
            answer.innerHTML = "";
            createButton("Utiliser la hache", "casse", "answer__opt", function(){
                song("sound/axe-door.wav", 1, false);
                answer.innerHTML = "";
                question.innerHTML = "Vous prenez votre élan et abattez votre lourde hache sur le coffre dans l'idée de le casser et de vous emparer de ce qu'il contient.";
                createButton("Continuer", "Continuer", "continuer", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "BRAVO !!! Vous avez explosé le coffre... et tout son contenu !<br>Quoi ? Ce n'était pas l'objectif ?";
                    createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                        ajoutParcours("coffre cassé");
                        direction();
                    });
                });
            });
            createButton("Revenir à l'entrée", "Continuer", "answer__opt", function(){
                direction();
            });
        }
    }
}

//_____________________________________________________________MIROIR_____________________________________________________________//
function miroirMagique(){
    //voleur//
        if (checkClasse("voleur") === true){
            answer.innerHTML = "";
            question.innerHTML = "En bon voleur, vous remarquez la valeur inestimable du miroir. Vous vous méfiez toutefois qu'un mécanisme caché ne vous piège lorsque, tout naturellement, vous tenterez de vous en emparrer.";
            createButton("Chercher un mécanisme", "ouvrir", "answer__opt", function(){
                answer.innerHTML = "";
                question.innerHTML = "Aucun mécanisme ne semble relié au miroir. Vous décidez donc de le saisir et commencez à revenir sur vos pas.";
                createButton("Continuer", "Continuer", "continuer", function(){
                    pertePV(1);
                    song("sound/glass.mp3", 1, false);
                    answer.innerHTML = "";
                    question.innerHTML = "BadAbOuM !!!"
                    container.classList.add('choc');
                    classDisplay.classList.add('chute');
                    nameClass.classList.add('glissement');
                    classe.classList.add('glissement');
                    createButton("Continuer", "Continuer", "continuer", function(){
                        container.classList.remove('choc');
                        classDisplay.classList.remove('chute');
                        nameClass.classList.remove('glissement');
                        classe.classList.remove('glissement');
                        answer.innerHTML = "";
                        question.innerHTML = "Quel maladroit vous faites. Dans votre empressement vous avez trébuché et êtes tombé et vous avez perdu 1 point de vie.";
                        createButton("Continuer", "Continuer", "continuer", function(){
                            answer.innerHTML = "";
                            question.innerHTML = "Le miroir est maintenant brisé. Par une étrange réaction, le métal précieux qui l'entourait se liquéfie et s'infiltre dans le sol.";
                           createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                                ajoutParcours("miroir brisé");
                                direction();   
                           });
                           });
                    });
                });
            });
            createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                direction();
            });
        }
        //barbare//
        if (checkClasse("barbare") === true){
            answer.innerHTML = "";
            question.innerHTML = "Ce mirroir ne vous inspire pas confiance... Il ne reflète pas votre image mais parait afficher la représentation d'une salle sombre au centre de laquelle se trouve un autel.";
            createButton("Continuer", "Continuer", "continuer", function(){
                answer.innerHTML = "";
                question.innerHTML = "Vous êtes un barbare... Quand un truc vous parait louche ou dangeureux, vous préférez taper en premier !";
                createButton("Frapper le miroir", "casse", "answer__opt", function(){
                    song("sound/glass.mp3", 1, false);
                    answer.innerHTML = "";
                    question.innerHTML = "Un simple coup de pieds dans le miroir suffit à le faire basculer et à le briser.";
                    createButton("Continuer", "Continuer", "continuer", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "Bon bah voilà... Mission accomplie non ?";
                        ajoutParcours("miroir brisé");
                        createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                            direction();
                        });
                    });
                });
                createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                    direction();
                });
            });
        }
        //magicien//
        if (checkClasse("magicien") === true){
            answer.innerHTML = "";
            question.innerHTML = "Ce miroir à manifestement quelque chose de magique. Vous le sentez.";
            createButton("Continuer", "Continuer", "continuer", function(){
                answer.innerHTML = "";
                question.innerHTML = "En vous approchant de plus près, vous comprenez qu'il est possible de passer au travers. Vous constatez également des inscitptions gravés sur le pourtour de son cadre. Du Lorem Ipsum !";
                answer.innerHTML = "";
                createButton("Déchiffrer le Lorem Ipsum", "déchiffrer", "answer__opt", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "«Ne te fais pas prier, entre sans te déchausser». Quel singulière formule...";
                        createButton("Passer à travers le miroir", "entrer", "answer__opt", function(){
                            answer.innerHTML = "";
                            question.innerHTML = "Vous arrivez dans une salle circulaire faiblement éclairée et appercevez un autel en son centre. Vous vous approchez de l'autel et y découvrez un nouveau message en glyphes.";
                            createButton("Lire le message", "lire", "answer__opt", function(){
                                answer.innerHTML = "";
                                question.innerHTML = "«Un prêté pour un rendu. Tu donnes, on te donne !»";
                                createButton("Continuer", "Continuer", "continuer", function(){
                                    answer.innerHTML = "";
                                    question.innerHTML = "Visiblement, il est question d'une transaction. L'autel est vide mais parait prévu pour recevoir un objet.";
                                    createButton("Déposer votre livre de sort", "prendre", "answer__opt", function(){
                                        song("sound/magic.mp3", 1, false);
                                        retraitItem("livre de sort");
                                        container.classList.add('white__flash');
                                        header.classList.add('none');
                                        setTimeout(function(){
                                            container.classList.remove('white__flash');
                                            header.classList.remove('none');
                                        }, 1000);
                                        answer.innerHTML = "";
                                        question.innerHTML = "Un flash lumineux vous ébloui brièvement et vous découvrez qu'en lieu et place de votre livre se trouve désormais une clef.";
                                        createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                            answer.innerHTML = "";
                                            question.innerHTML = "Vous prenez la clef et la déposez au fond de votre poche.";
                                            song("sound/Fanfare_1.wav", 1);
                                            ajoutItem("clef mystique");
                                            ajoutParcours("miroir brisé");
                                            createButton("Revenir au début du donjon", "retour", "answer__opt", function(){
                                                direction();
                                            });
                                        });
                                        createButton("Revenir au début du donjon", "retour", "answer__opt", function(){
                                            direction();
                                        });
                                    });
                                    createButton("Revenir au début du donjon", "retour", "answer__opt", function(){
                                        direction();
                                    });
                                });
                            });
                            createButton("Revenir au début du donjon", "retour", "answer__opt", function(){
                                direction();
                            });
                        });
                        createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                            direction();
                        });
                    });
                    createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                        direction();
                    });
            });
        }
}
//_____________________________________________________________TROLL_____________________________________________________________//
function troll(){
    if (checkParcours("troll") === false){
    answer.innerHTML = "";
    question.innerHTML = "Une faible lumière apparait au loin. Vous accélérez le pas et commencez à appercevoir une ombre au milieu de cette clarté soudaine. Une ombre gigantesque et menaçante !";
    createButton("Continuer", "Continuer", "answer__opt", function(){
        answer.innerHTML = "";
        question.innerHTML = "Vous vous approchez à pas feutrés et reconnaissez la silhouette d'un troll des cavernes. Par chance, il vous tourne le dos et n'a probablement pas encore remarqué votre présence.";
        createButton("Continuer", "Continuer", "continuer", function(){
            //__________________________________________BARBARE________________________________________________________//
            if (checkClasse("barbare") === true){
                answer.innerHTML = "";
                question.innerHTML = "Affronter un adversaire de dos n'est pas digne d'un barbare ! Vous remarquez un pot en terre cuite à votre droite";
                createButton("Attirer son attention", "attirer", "answer__opt", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "Le troll se retourne brusquement et, en vous appercevant, se met à gromeler dans un langue qui vous est inconnue.<br>«M'enfin c'est un troll, vous dites vous, ce qu'il dit est soit stupide, soit menaçant !»";
                    createButton("L'insulter en varchar", "insulter", "answer__opt", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "Mots varchariens intraduisibles...";
                        song("sound/bla.mp3", 1, false);
                        createButton("Continuer", "Continuer", "continuer", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "Le troll incline la tête sur le côté, comme s'il avait compris ce que vous veniez de lui dire. La créature lève alors son poing droit au dessus de sa tête avant de vous asseiner un puissant coup sur le crâne. ";
                        setTimeout(function(){
                            song("sound/punch.mp3", 1, false);
                        }, 1000);
                        createButton("Aïe", "aie", "answer__opt", function(){
                            answer.innerHTML = "";
                            question.innerHTML = "Visiblement, il n'a pas vraiment apprécié votre entrée en matière. Vous perdez 1 point de vie."
                            pertePV(1);
                                createButton("Continuer", "Continuer", "continuer", function(){
                                    answer.innerHTML = "";
                                    question.innerHTML= "Blessé et surtout vexé, vous entrez dans une rage folle.";
                                    createButton("Attaquer", "attaquer", "answer__opt", function(){
                                        song("sound/slash2.mp3", 1, false);
                                        ajoutParcours("troll");
                                        answer.innerHTML = "";
                                        question.innerHTML = "Vous venez d'envoyer votre hache en plein dans le crâne du troll. Ce coup lui aura été fatal et il s'effondre aussitôt de toute sa masse sur le sol, faisant trembler les murs de pierre du donjon et soulevant des volutes de poussière.";
                                        createButton("Continuer", "Continuer", "continuer", function(){
                                            answer.innerHTML = "";
                                            question.innerHTML = "Une fois la poussière dissipée, vous apercevez une porte. Elle devait être cachée par la stature imposante du troll car vous ne l'aviez pas remarqué jusque là."
                                            createButton("Vous approcher de la porte", "porte", "answer__opt", function(){
                                                answer.innerHTML = "";
                                                question.innerHTML = "Vous enjambez le corps sans vie du troll et vous tenez à présent face à une impressionnante porte en bois massif. Une serrue à l'aura étrange est placée en son centre.";
                                                createButton("Défoncer la porte", "defoncer", "answer__opt", function(){
                                                    song("sound/axe-door.wav", 1, false);
                                                    answer.innerHTML = "";
                                                    question.innerHTML = "Vaine tentative. Votre hache rebondit contre la porte comme si elle était faite de granit.";
                                                    createButton("Fouiller le troll", "Continuer", "answer__opt", function(){
                                                        answer.innerHTML = "";
                                                        question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef. L'intelligence n'est pas la compétence la plus développée chez vous mais vous êtes prêt à parier que cette clef correspond à la porte qui se trouve dans la même pièce";
                                                        createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                                            song("sound/Fanfare_1.wav", 1);
                                                            ajoutItem("clef mystique");
                                                            answer.innerHTML = "";
                                                            question.innerHTML = "La clef en votre possession, vous n'avez plus qu'à vous diriger de nouveau vers la porte.";
                                                            createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                                                firstDoor();
                                                            });
                                                        });
                                                    });
                                                    createButton("Humilier le troll", "Continuer", "answer__opt", function(){
                                                        song("sound/troll.mp3", 1, false);
                                                        answer.innerHTML = "";
                                                        question.innerHTML = "Vous vous mettez spontannément à éffectuer un tea-bag au dessus de la dépouille du troll... très classe...";
                                                        if (aventurier.vie.length < 3){
                                                            createButton("Continuer", "continuer", "continuer", function(){
                                                                answer.innerHTML = "";
                                                                question.innerHTML = "Vous reprenez confiance en vous et les dieux barbares vous accordent leur bénédiction. Vous gagnez 1 point de vie";
                                                                gainPV(1);
                                                                createButton("Fouiller le troll", "fouiller", "answer__opt", function(){
                                                                    answer.innerHTML = "";
                                                                    question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef.";
                                                                    createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                                                        song("sound/Fanfare_1.wav", 1);
                                                                          ajoutItem("clef mystique");
                                                                            answer.innerHTML = "";
                                                                            question.innerHTML = "Vous venez d'obtenir une clef.";
                                                                            createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                                                                firstDoor();
                                                                            });
                                                                    });
                                                                });
                                                            });
                                                        } else {
                                                            createButton("Fouiller le troll", "fouiller", "answer__opt", function(){
                                                                answer.innerHTML = "";
                                                                question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef.";
                                                                createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                                                    song("sound/Fanfare_1.wav", 1);
                                                                      ajoutItem("clef mystique");
                                                                        answer.innerHTML = "";
                                                                        question.innerHTML = "Vous venez d'obtenir une clef.";
                                                                        createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                                                            firstDoor();
                                                                        });
                                                                });
                                                            });
                                                        }
                                                    });
                                                });
                                            });
                                            createButton("Fouiller le troll", "fouiller", "answer__opt", function(){
                                                answer.innerHTML = "";
                                                question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef.";
                                                createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                                    song("sound/Fanfare_1.wav", 1);
                                                      ajoutItem("clef mystique");
                                                        answer.innerHTML = "";
                                                        question.innerHTML = "Vous venez d'obtenir une clef.";
                                                        createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                                            firstDoor();
                                                        });
                                                });
                                            });
                                        });
                                    });
                                });
                        });
                    });   
                    });
                    createButton("Répondre avec votre hache", "frapper", "answer__opt", function(){
                        song("sound/axe-squish.mp3", 1, false);
                        answer.innerHTML = "";
                        question.innerHTML = "Un virulent combat s'engage contre cette créature que vous ne pensiez pas si rapide... Malgré tout, vos reflexes sont supérieurs et vous parvenez à terrasser la bête sans y laisser de plume. Bravo Barbare !! C'était un beau combat !!!";
                        createButton("Continuer", "Continuer", "continuer", function(){
                            answer.innerHTML = "";
                            question.innerHTML = "Un fois votre souffle repris, vous appercevez devant vous une porte. Elle devait être cachée par la stature imposante du troll car vous ne l'aviez pas remarqué jusque là.";
                            createButton("Vous approcher de la porte", "porte", "answer__opt", function(){
                                answer.innerHTML = "";
                                question.innerHTML = "Vous enjambez le corps sans vie du troll et vous tenez à présent face à une impressionnante porte en bois massif. Une serrure à l'aura étrange est placée en son centre.";
                                createButton("Défoncer la porte", "defoncer", "answer__opt", function(){
                                    song("sound/axe-door.wav", 1);
                                    answer.innerHTML = "";
                                    question.innerHTML = "Vaine tentative. Votre hache rebondit contre la porte comme si elle était faite de granit.";
                                    createButton("Fouiller le troll", "Continuer", "answer__opt", function(){
                                        answer.innerHTML = "";
                                        question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef. L'intelligence n'est pas la compétence la plus développée chez vous mais vous êtes prêt à parier que cette clef correspond à la porte qui se trouve dans la même pièce";
                                        createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                            song("sound/Fanfare_1.wav", 1);
                                            ajoutItem("clef mystique");
                                            answer.innerHTML = "";
                                            question.innerHTML = "La clef en votre possession, vous n'avez plus qu'à vous diriger de nouveau vers la porte.";
                                            createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                                firstDoor();
                                            });
                                        });
                                    });
                                });
                            });
                            createButton("Fouiller le troll", "fouiller", "answer__opt", function(){
                                answer.innerHTML = "";
                                question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef.";
                                createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                    song("sound/Fanfare_1.wav", 1);
                                      ajoutItem("clef mystique");
                                        answer.innerHTML = "";
                                        question.innerHTML = "Vous venez d'obtenir une clef.";
                                        createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                            firstDoor();
                                        });
                                });
                            });
                        });
                    });
                });
                createButton("Attaquer quand même", "Continuer", "answer__opt", function(){
                    song("sound/slash2.mp3", 1);
                    answer.innerHTML = "";
                    question.innerHTML = "Vous lancez votre hache en plein dans l'arrière du crâne du troll. Bien visé !<br>La créature s'effondre sur elle-même, révélant une porte jusque là dissimulée derrière son imposante masse.";
                    createButton("Continuer", "Continuer", "continuer", function(){
                        ajoutParcours("troll");
                        answer.innerHTML = "";
                        question.innerHTML = "Vous avez certes terrassé le troll, mais votre méthode vous a valu la désapprobation des dieux. Vous perdez 1 point de vie.";
                        pertePV(1);
                            createButton("Vous approcher de la porte", "porte", "answer__opt", function(){
                                answer.innerHTML = "";
                                question.innerHTML = "Vous enjambez le corps sans vie du troll et vous tenez à présent face à une impressionnante porte en bois massif. Une serrure à l'aura étrange est placée en son centre.";
                                createButton("Défoncer la porte", "defoncer", "answer__opt", function(){
                                    song("sound/axe-door.wav", 1);
                                    answer.innerHTML = "";
                                    question.innerHTML = "Vaine tentative. Votre hache rebondit contre la porte comme si elle était faite de granit.";
                                    createButton("Fouiller le troll", "Continuer", "answer__opt", function(){
                                        answer.innerHTML = "";
                                        question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef. L'intelligence n'est pas la compétence la plus développée chez vous mais vous êtes prêt à parier que cette clef correspond à la porte qui se trouve dans la même pièce";
                                        createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                            song("sound/Fanfare_1.wav", 1);
                                            ajoutItem("clef mystique");
                                            answer.innerHTML = "";
                                            question.innerHTML = "La clef en votre possession, vous n'avez plus qu'à vous diriger de nouveau vers la porte.";
                                            createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                                firstDoor();
                                            });
                                        });
                                    });
                                });
                            });
                            createButton("Fouiller le troll", "fouiller", "answer__opt", function(){
                                answer.innerHTML = "";
                                question.innerHTML = "En tatonnant son corps flasque, vous remarquer une bourse cachée dans le pli d'un bourlet. La bourse contient une clef.";
                                createButton("Prendre la clef", "prendre", "answer__opt", function(){
                                    song("sound/Fanfare_1.wav", 1);
                                      ajoutItem("clef mystique");
                                        answer.innerHTML = "";
                                        question.innerHTML = "Vous venez d'obtenir une clef.";
                                        createButton("Aller vers la porte", "Continuer", "answer__opt", function(){
                                            firstDoor();
                                        });
                                });
                            });
                    });
                });
                createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "Désolé mais «revenir sur vos pas», c'est comme fuir... C'est lâche. <br>Les dieux barbares condamnent votre couardise et vous perdez 1 point de vie.";
                    pertePV(1);
                    createButton("Continuer", "Continuer", "continuer", function(){
                        direction();
                    });
                });
            }
            //_________________________________________________________________________________________________________MAGICIEN_________________________________________________________________________________________________________
            if (checkClasse("magicien") === true){
                answer.innerHTML = "";
                question.innerHTML = "La bête est monstrueuse (même de dos) et fait clairement 4 fois votre taille.<br>L'affronter dans un combat singulier serait :";
                createButton("Stupide", "Continuer", "answer__opt", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "Un petit sort dont vous avez le secret devrait pouvoir venir à bout du monstre...";
                    createButton("Utiliser votre magie", "Continuer", "answer__opt", function(){
                        song("sound/thunder.mp3", 1);
                        answer.innerHTML = "";
                        question.innerHTML = "Des éclairs jaillissent de vos doigts et foudroient littéralement le troll. Le pauvre, vous auriez persque de la peine pour lui... Mais bon, c'est comme ça. <br>Du monstrueux et impressionant troll, il ne reste plus désormais qu'un petit tas de cendre.";
                        ajoutParcours("troll");
                        createButton("Continuer", "Continuer", "continuer", function(){
                            answer.innerHTML = "";
                            question.innerHTML = "Vous appercevez à présent une porte, jursqu'alors dissimulée par l'imposante stature du troll.";
                            createButton("Vous approcher de la porte", "porte", "answer__opt", function(){
                                firstDoor();
                            });
                        });
                    });
                });
                createButton("Courageux", "retour", "answer__opt", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "Vous vous élancez droit sur lui en hurlant aussi fort que possible. Le but n'est pas tant d'impressioner le monstre que de vous même vous abrutir assez pour oublier l'absurdité de ce que vous êtes en train de faire.";
                    createButton("Continuer", "Continuer", "continuer", function(){
                        song("sound/punch.mp3", 1);
                        setTimeout(function(){
                            pertePV(2);
                        }, 2000);
                        answer.innerHTML = "";
                        question.innerHTML = "Le problème est qu'en criant ainsi, le troll vous a entendu et a eu le temps de se préparer à votre arrivée. Au moment où vous êtes enfin à sa hauteur, il vous accueille avec un violent revers de main qui vous met littéralement sur les fesses, 10 mètres en arrière.<br>Vous avez perdu 2 points de vie.";
                        createButton("Continuer", "Continuer", "continuer", function(){
                            ajoutParcours("troll");
                            answer.innerHTML = "";
                            question.innerHTML = "Vous vous relevez douloureusement et, alors que votre regard se dirige vers l'endroit où se trouvait le troll quelques instants plus tôt, vous constatez qu'il est parti.<br>En revanche, vous remarquez une porte au fond du couloir";
                            createButton("Aller vers la porte", "ouvrir", "answer__opt", function(){
                                firstDoor();
                            });
                            createButton("Revenir à l'entrée du donjon", "Continuer", "answer__opt", function(){
                                direction();
                            });
                        });
                    });
                });
            }
            //_________________________________________________________________________________________________________VOLEUR_________________________________________________________________________________________________________
            if (checkClasse("voleur") === true){
                answer.innerHTML = "";
                question.innerHTML = "Par chance, la créature vous tourne le dos et ne semble pas avoir remarqué votre présence...";
                createButton("Lui faire les poches", "attirer", "answer__opt", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "Vous manquez de vomir par deux fois alors que vos mains baladeuses cherchent quelque chose d'intéressant à dérober... Sous l'un des bourlets du monstre, vous sentez une bourse avec à l'intérieur ce qui semble être une clef.";
                    createButton("Prendre la clef", "prendre", "answer__opt", function(){
                        ajoutItem("clef mystique");
                        song("sound/Fanfare_1.wav", 1);
                        answer.innerHTML = "";
                        question.innerHTML = "Vous venez d'obtenir une clef. Reste à vous débarrasser du troll...";
                        createButton("Distraire son attention", "Continuer", "answer__opt", function(){
                            song("sound/jar.mp3", 1);
                            answer.innerHTML = "";
                            question.innerHTML = "Vous lancez au loin un pot de terre cuite trouvé à vos pieds. Le troll s'éloigne en direction du bruit de l'impact... Vous êtes cependant certain que la diversion ne durera qu'un temps. Huit secondes selon vos estimations.";
                            ajoutParcours("troll");
                             let timer = setTimeout(function(){
                                answer.innerHTML = "";
                                question.innerHTML = "Trop tard ! Le troll a compris votre subterfuge et est revenu sur ses pas. Il vous attrape par le col et vous fracasse brutalement le crane sur le sol.";
                                createButton("Continuer", "Continuer", "continuer", function(){
                                    song("sound/punch.mp3", 1);
                                    setTimeout(function(){
                                        pertePV(10);
                                    }, 2000);  
                                });
                            }, 8000);
                            createButton("Continuer", "Continuer", "continuer", function(){
                                answer.innerHTML = "";
                                question.innerHTML = "Le troll parti, vous remarquez une porte au fond du couloir.";
                                createButton("Aller vers la porte", "ouvrir", "answer__opt", function(){
                                    clearTimeout(timer);
                                    firstDoor();
                                });
                            });
                        });
                    });
                });
                createButton("Attirer son attention", "attention", "answer__opt", function(){
                    song("sound/jar.mp3", 1);
                    // console.log(themeSong);
                    answer.innerHTML = "";
                    question.innerHTML = "Vous tapez dans un pot de terre cuite situé à proximité. Le troll se retourne brusquement vers vous et, pendant ce temps, vous vous interrogez sur le sens de votre vie, vos choix et, de façon plus précise, celui qui vous a amené à penser que vous feriez le poids face à une créature quatre fois plus grosse que vous...";
                    createButton("Continuer", "Continuer", "continuer", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "Le troll vous attrappe par les cheveux et vous fracasse brutalement le crane sur le sol.";
                        createButton("Continuer", "Continuer", "continuer", function(){
                            pertePV(10);
                        });
                    });   
                });
                if (checkItem("crochets") === true){
                createButton("Le distraire", "Continuer", "answer__opt", function(){
                    answer.innerHTML = "";
                    question.innerHTML = "Vous remarquez un pot de terre cuite au sol. Vous décidez de vous en servir pour attirer l'attention du troll ailleurs et vous permettre de passer.";
                    createButton("Lancer le pot", "Continuer", "answer__opt", function(){
                        song("sound/jar.mp3", 1);
                        answer.innerHTML = "";
                        question.innerHTML = "Le troll s'éloigne en direction du bruit de l'impact... Vous êtes cependant certain que la diversion ne durera qu'un temps. Cinq secondes selon vos estimations.";
                        createButton("Continuer", "Continuer", "continuer", function(){
                            let timer = setTimeout(function(){
                                answer.innerHTML = "";
                                question.innerHTML = "Trop tard ! Le troll a compris votre subterfuge et est revenu sur ses pas. Il vous poursuit et fini par vous attraper par le col puis vous fracasse brutalement le crane sur le sol.";
                                createButton("Continuer", "Continuer", "continuer", function(){
                                    song("sound/punch.mp3", 1);
                                    setTimeout(function(){
                                        pertePV(10);
                                    }, 2000);
                                });
                            }, 5000);
                            answer.innerHTML = "";
                            question.innerHTML = "Le troll parti, vous remarquez une porte au fond du couloir. Vous vous en approchez. Vous remarquez aussitôt l'imposante serrure en son centre. Vous n'avez cependant aucune clef sur vous...";
                            if (checkItem("crochets") ===true){
                                createButton("Ouvrir la porte avec les crochets", "ouvrir", "answer__opt", function(){
                                    clearTimeout(timer);
                                    firstDoor();
                                });
                            } else {
                                firstDoor();
                            }
                        });
                    });
                });
            }
            }
        });
    });
    if (checkClasse("barbare") === true){
        createButton("Vous enfuir", "retour", "answer__opt", function(){
                answer.innerHTML = "";
                question.innerHTML = "Vous êtes un barbare. Vous enfuir cause votre déshonneur. Pour la peine, vous perdez 1 point de vie.";
                pertePV(1);
                createButton("Continuer", "continuer", "continuer", function(){
                    direction();
                });
            });
    } else {
        createButton("Revenir sur vos pas", "retour", "answer__opt", function(){
            direction();
        });
    }
    
} else {
    answer.innerHTML = "";
    question.innerHTML = "Vous vous retrouvez de nouveau devant la porte qui se trouvait cachée derrière le troll.";
    createButton("Tenter de l'ouvrir", "continuer", "answer__opt", function(){
        firstDoor();
    });
    createButton("Revenir à l'entrée du donjon", "Continuer", "answer__opt", function(){
        direction();
    });
}
}

//_____________________________________________________PORTE TROLL_______________________________________________________________//
function firstDoor(){
    if ((checkItem("clef mystique") === true) || (checkItem("crochets") === true)){
        answer.innerHTML = "";
        if  (checkClasse("voleur") === true){
            retraitItem("crochets");
            question.innerHTML = "Vous manoeuvrez rapidement dans la serrure, de peur que le troll ne vous surprène. Finalement, le verrou est prêt à cèder.";
        } else {
            question.innerHTML = "Au milieu de la porte, une serrure (logique pour une porte). Vous y introduisez la clef récupérée quelques instants plutôt. Vous sentez que le verrou est prêt à cèder.";
        }
        createButton("Dévérouiller la porte", "continuer", "answer__opt", function(){
            song("sound/Lock 3.wav", 0.6);
            retraitItem("clef mystique");
            answer.innerHTML = "";
            question.innerHTML = "Un bruit de cliquetis se fait entendre et raisonne dans la pièce. La porte se met à gronder, à trembler et, dans un craquement à en réveiller les morts, elle s'ouvre.";
            createButton("Continuer", "continuer", "continuer", function(){
                answer.innerHTML = "";
                question.innerHTML = "Vous pénétrez dans une petite pièce aux murs de pierre recouverts de mousse et de lierre. Il ne semble y avoir d'autre issue que la porte que vous venez de franchir. <br>Au centre de la salle, un puit de lumière vient projeter un halo sur une sorte de piedestale.";
                if (checkClasse("voleur") === true){
                    createButton("Détecter les pièges", "continuer", "answer__opt", function(){
                        answer.innerHTML = "";
                        question.innerHTML = "Votre compétence de détection des pièges vous permet de voir un mécanisme dissimulé au niveau du plafond. L'idée générale semble être de se servir de la salle comme d'une énorme presse... Un piège mortel.<br>Vous ne distinguez cependant pas de dispositif d'activation.";
                        createButton("Tenter de casser le mécanisme", "continuer", "answer__opt", function(){
                            song("sound/dagger.wav", 1);
                            answer.innerHTML = "";
                            question.innerHTML = "Vous lancez votre dague sur le mécanisme du plafond. Vous ne parvenez pas à le briser mais votre dague reste coincée. Quel que soit la façon de l'activer, cela devrait vous permettre de gagner du temps.";
                            createButton("Vous approcher", "continuer", "answer__opt", function(){
                                ajoutParcours("piège bloqué");
                                retraitItem("dagues");
                                piedestal();
                            });
                        });
                        createButton("Vous approcher", "continuer", "answer__opt", function(){
                            piedestal();
                        });
                    });    
                }
                createButton("Vous approcher", "continuer", "answer__opt", function(){
                    piedestal();
                });
            });
        });
    } else {
        answer.innerHTML = "";
        question.innerHTML = "Il vous manque visiblement quelque chose... Vous feriez mieux de retourner sur vos pas et revenir ici un peu plus tard.";
        createButton("Revenir à l'entrée du donjon", "continuer", "answer__opt", function(){
            direction();
        });
    }
}

function piedestal(){
    answer.innerHTML = "";
    question.innerHTML = "Le piédestal parait ancien, très ancien. A son sommet, une tablette de bronze est disposée à la verticale. Les mots suivants y sont gravés :<br>«Vous qui entrez ici, si vous voulez ressortir vivant, résolvez cette énigme dans le temps imparti»";
    createButton("Continuer", "continuer", "continuer", function(){
        answer.innerHTML = "";
        question.innerHTML = "Un bruit signalant la mise en marche d'un mécanisme se fait entendre puis les murs de la pièce de laquelle vous êtes à présent prisonnier se mettent à vibrer, à bourdonner. En levant les yeux, vous voyez le plafond se rapprocher petit à petit de vous !";
        createButton("Continuer", "continuer", "continuer", function(){
            answer.innerHTML = "";
            question.innerHTML = "Sur la tablette, les mots suivants sont à présents inscrits : <br>«Cette pièce en elle même est un piège mortelle et pour vous en sortir, il va vous falloir résoudre cette énigme. Vous avez une minute après quoi, vous serez écrasé !»";
            createButton("Continuer", "continuer", "continuer", function(){
                animation.classList.add("timer");
                animation.classList.remove("none");
                enigme();
            });

        });
    });
}
//____________________________________________ENIGME_______________________________________________________________//
function enigme(){
    let sound = document.createElement("audio");
    sound.src = "sound/clock.mp3";
    sound.autoplay = true;
    sound.volume = 1;
    clock = sound;
    answer.innerHTML = "";
    let input = document.createElement("input");
    if (checkClasse("magicien") === true){
        question.innerHTML = "«Du repos des humains, implacable ennemie.<br>J'ai rendu mille amants envieux de mon sort.<br>Je me repais de sang et retrouve ma vie dans les bras de celui qui souhaite ma mort.<br>Que suis-je ?»<br>La lettre «P» vous apparait tel un flash.";
    } else {
        question.innerHTML = "«Du repos des humains, implacable ennemie.<br>J'ai rendu mille amants envieux de mon sort.<br>Je me repais de sang et retrouve ma vie dans les bras de celui qui souhaite ma mort.<br>Que suis-je ?»";
    }
    input.placeholder = "Votre réponse";
    input.type = "text";
    answer.appendChild(input);
    input.classList.add("answer__input");
    input.id = "input";
    let temp = 60;
    if (checkParcours("piège bloqué")===true){
        temp = temp+30;
    }
    createButton("Valider", "Valider", "answer__opt", function(){
        let reponse = document.getElementById("input").value;
        if (reponse === "une puce" || reponse === "puce" || reponse === "Puce" || reponse === "Une puce"){
            clock.pause();
            clearInterval(timer);
            answer.innerHTML = "";
            question.innerHTML = "Vous avez eu chaud, mais bravo !!";
            createButton("Continuer", "Continuer", "continuer", function(){
                salle3();
            });
        } else {
            input.value = "";
        }
    });
    let timer = setInterval(function(){
        if (temp>0){
            temp -= 1;
        // console.log(temp);
        if ((checkClasse("barbare") === true) && (temp === 10)){
            answer.innerHTML = "";
            question.innerHTML = "Face à cet échec et à cette mort assurée, vous décidez de faire ce que tout bon barbare ferait : vous servir de votre tête non pas pour réfléchir mais pour taper.";
            createButton("Frapper la tablette", "Continuer", "answer__opt", function(){
                clock.pause();
                song("sound/punch.mp3", 1);
                answer.innerHTML = "";
                question.innerHTML = "Vous frappez la tablette d'un violent coup de tête. Elle se brise aussitôt en deux et un bruit sourd vous averti que le mécanisme controlant le piège vient de s'arrêter.";
                clearInterval(timer);
                createButton("Continuer", "Continuer", "continuer", function(){
                    salle3();
                });
            });
        }
        if (temp===0){
            answer.innerHTML = "";
            question.innerHTML = ecrase;
            createButton("Continuer", "Continuer", "continuer", function(){
                clock.pause();
                pertePV(3);
            });
        }
        animation.innerHTML = temp;
        animation.classList.add("timer");
        }
    }, 1000);
}

function salle3(){
    song("sound/dungeon_theme_1.wav", 1, true);
    animation.innerHTML = "";
    question.innerHTML = "Félicitations, vous êtes arrivés au bout de la partie free to play de ce jeu.<br>Vous pouvez dès à présent précommander la prochaine extension en soulageant votre bourse de quelques 49,99€.";
    question.innerHTML = "Merci d'avoir jouer à ce jeu. Varquest Dungeon II arrive bientôt...";
    answer.innerHTML = "";
    createButton("Recommencer", "Redémarrer", "answer__opt", function(){
        location.reload()
    });
} 


