#!/bin/sh
#    9ne - an online, emacs like code editor
#    Copyright (C) 2006-2007 Rob Rohan
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License along
#    with this program; if not, write to the Free Software Foundation, Inc.,
#    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

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

./jsmin.exe < "$1/$2_temp" > "$1/$2" "$COPYRIGHT"

rm "$1/$2_temp"
