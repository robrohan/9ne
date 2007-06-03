#!/bin/sh

# 1 = the directory where the js files live (the ones to combine)
# 2 = the new file name
# 3 = the copyright
# 4 = the main file (the file to go in first)

MAIN_FILE=$4
MAIN_JS_FILE=`find $1 -name "*.js" | grep $MAIN_FILE`
OTHER_JS_FILES=`find $1 -name "*.js" | grep -v $MAIN_FILE`

OUT_FILE=$2
COPYRIGHT=$3

cat $MAIN_JS_FILE > "$1/$2_temp"
cat $OTHER_JS_FILES >> "$1/$2_temp"

./jsmin < "$1/$2_temp" > "$1/$2" "$COPYRIGHT"

rm "$1/$2_temp"
