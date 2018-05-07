#!/bin/bash

#========== DOC commande sort ==========
#sort test.csv -s -t, -k1,1n -k2,2d -k3,3nr | sort -s -t, -k1,1n -k2,2d -u

#sort test.csv -s -t, -k1,1n -k2,2dr -k3,3n | sort -s -t, -k1,1n -u

# -s empêche le tri naturel par défaut sur toute la ligne à la fin des tris renseignés.
# -t, indique le caractère séparateur des colonnes (ici la virgule)
# -k1,1n indique qu'on demande un tri des lignes sur la colonne 1 (commence à 1)
#        (n = numerical, d= dictionary, r= inverser l'ordre résultat du tri)
# -u indique qu'à valeurs égales sur les colonnes choisies pour faire le tri,
#        on ne garde que la première ligne rencontrée et on supprime les autres duplicats.
#        Attention: c'est la 1e ligne rencontrée dans les données brutes, avant tri (non triées)
#========== FIN ========================


#========== ALGO sort ==========
#le premier sort trie avec en premier les colonnes clefs [model,examination,techniques,version]
#puis à valeurs égales dans ces colonnes, trie par ordre croissant les Test Fail
#puis à valeurs égales pour Test Fail, trie par ordre décroissant les Test Passed
#puis à valeurs égales pour Test passed, trie par ordre ??? décroissant la duration.

#le 2e sort trie les colonnes clefs [model,examination,techniques,version]
# avec -u, à valeurs égales dans ces colonnes clefs, ne garde que la première ligne rencontrée
# (qui est la ligne filtrée selon le premier sort (fail min, passed max, duration max))
#========== FIN ================



#stocke la 1e ligne du csv dans la variable firstline.
read -r firstline < $1;

#stocke les entetes des colonnes (1e ligne) dans la variable cols.
IFS=',' read -r -a cols <<< $firstline;

#active l'option nocasematch : Bash ignore la casse pour plusieurs types de comparaisons, 
#notamment celles entre [[ ]].
shopt -s nocasematch;

printf "\n===== [index, nom] des colonnes ===== \n";
for index in "${!cols[@]}"
do
    printf "$(($index +1)) ${cols[index]} \n";

    #on stocke les positions des colonnes clefs du tri futur, et les colonnes a ordonner 
    #quand il y a des doublons.
    #L'index de départ commence a 1 dans le man sort (option -k).
    [[ ${cols[index]} =~ model ]] && let mod=$(($index +1));
    [[ ${cols[index]} =~ examination ]] && let exa=$(($index +1));
    [[ ${cols[index]} =~ technique ]] && let tech=$(($index +1));
    [[ ${cols[index]} =~ version ]] && let ver=$(($index +1));

    [[ ${cols[index]} =~ fail ]] && let fail=$(($index +1));
    [[ ${cols[index]} =~ fin|pass ]] && let pass=$(($index +1));
    [[ ${cols[index]} =~ duration ]] && let dur=$(($index +1));
done;
printf "===================================== \n\n";

#check avec l' utilisateur
printf "[CHECK] le menu au-dessus comporte-il bien les entetes des colonnes du csv ?\n";
select yn in "Yes" "No"; do
    case $yn in
        #on supprime la 1e ligne et ses duplicats du csv (pour l'exclure du tri futur).
        Yes ) sed -i.bak "/${firstline}/d" $1; break;;
        No ) exit;;
    esac
done

#formatage des parametres de la commande sort (voir commentaires au debut pour les options)
colclefs="-k${mod},${mod} -k${exa},${exa} -k${tech},${tech} -k${ver},${ver}";
#-k${dur},${dur}nr ? ou sans r ? (max or min)
colfiltr="-k${fail},${fail}n -k${pass},${pass}nr -k${dur},${dur}nr";

#affichage de la commande finale.
echo "sort $1 -s -t, $colclefs $colfiltr | sort -s -t, $colclefs -u -o \"${1%.*}filtre.csv\";";

#nb_lignes avec duplicats.
echo "nb lignes avant: $(wc -l $1)";

#suppression des duplicats.
sort $1 -s -t, $colclefs $colfiltr | sort -s -t, $colclefs -u -o "${1%.*}filtre.csv";

#ajout de la ligne entete au debut du fichier.
sed -i "1s/^/${firstline}\n/" "${1%.*}filtre.csv";

#nb_lignes sans duplicats
echo "nb lignes apres: $(wc -l "${1%.*}filtre.csv";)";

#on supprime le fichier $1.csv et on renomme le fichier $1.csv.bak en $1.csv
mv -f $1.bak $1;