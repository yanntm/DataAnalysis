#!/bin/bash

#sort test.csv -s -t, -k1,1n -k2,2d -k3,3dr | sort -s -t, -k1,1n -k2,2d -u

sort test.csv -s -t, -k1,1n -k2,2dr -k3,3n | sort -s -t, -k1,1n -u

# -s empêche le tri naturel par défaut sur toute la ligne à la fin des tris renseignés.
# -t, indique le caractère séparateur des colonnes (ici la virgule)
# -k1,1n indique qu'on demande un tri des lignes sur la colonne 1 (commence à 1)
#        (n = numerical, d= dictionary, r= inverser l'ordre résultat du tri)
# -u indique qu'à valeurs égales sur les colonnes choisies pour faire le tri,
#        on ne garde que la première ligne rencontrée et on supprime les autres duplicats.
#        Attention: c'est la 1e ligne rencontrée dans les données brutes, avant tri (non triées)


#========== ALGO ==========
#le premier sort trie avec en premier les colonnes clefs [model,examination,techniques,version]
#puis à valeurs égales dans ces colonnes, trie par ordre croissant les Test Fail
#puis à valeurs égales pour Test Fail, trie par ordre décroissant les Test Passed
#puis à valeurs égales pour Test passed, trie par ordre ??? décroissant la duration.

#le 2e sort trie les colonnes clefs [model,examination,techniques,version]
# avec -u, à valeurs égales dans ces colonnes clefs, ne garde que la première ligne rencontrée
# (qui est la ligne filtrée selon le premier sort (fail min, passed max, duration max))
#========== FIN ===========
