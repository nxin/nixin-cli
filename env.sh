#!/bin/bash

case "$1" in

	'CENTOS')
		 NPM_EXPORT_PATH="NODE_PATH=/usr/lib/node_modules/"  
	;;
	'LINUX')
		 NPM_EXPORT_PATH="NODE_PATH=/usr/lib/node_modules/"  
	;;

	'MACOSX')
		 NPM_EXPORT_PATH="NODE_PATH=/usr/local/lib/node_modules"  
	;;

	*)
		echo -e "\nUSARE $0 con le seguenti OPZIONI: CENTOS, LINUX o MACOSX\n"
		exit;
	;;
esac;

USER_PATH=$(whoami)

cat /home/$USER_PATH/.bash_profile | grep NODE_PATH >>/dev/null
NPM_EXIST=$(echo $?)

if [ $NPM_EXIST != 0 ]; then
	echo -e "\n##########\n$NPM_EXPORT_PATH\n##########\n" >>/home/$USER_PATH/.bash_profile
	echo -e "\nBASH_PROFILE AGGIORNATA\n"
else 
	echo -e "\nEXPORT PATH GIA' CONFIGURATA PER L'UTENTE\n"
fi
