#!/usr/bin/env bash
set -e
set -x

update-resolve

REAL_IS_BUILDING="${BUILDING}"
export BUILDING=yes

if [ "${REAL_IS_BUILDING}" = "yes" ]; then
	if [ -z "${NPM_ARGUMENTS}" ]; then
		. /npm-install/source
	fi
else
	tsc -p src
fi

export PATH="${PATH}:./node_modules/.bin"

if [ "${REAL_IS_BUILDING}" = "yes" ]; then
	node dist/create-config.js
else
	cd ..
	jenv node ./package/dist/create-config.js
	cd package
fi

dts-concat . -o index.d.ts
echo -e "\e[38;5;10mcompile ok...\e[0m"

if [ "${REAL_IS_BUILDING}" = "yes" ]; then
	set +e
	make-private-version ${NPM_ARGUMENTS} .
	STATE=$?
	set -e
	
	if [ ${STATE} -eq 0 ]; then
		# start publish new package
		npm ${NPM_ARGUMENTS} publish
		echo -e "\e[38;5;10mpublish ok...\e[0m"
	elif [ ${STATE} -eq 100 ]; then
		echo -e "\e[38;5;10mnot changed, skip publish...\e[0m"
	else
		exit ${STATE}
	fi
else
	echo -e "\e[38;5;14mskip publish...\e[0m"
fi

rm -f *.tgz
