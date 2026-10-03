#!/bin/bash
# sheet.sh out.png w img1 img2 ... (2 columns)
out=$1; w=$2; shift 2; n=$#; args=(); f=""; i=0
for img in "$@"; do args+=(-i "$img"); f+="[$i]scale=$w:-1[s$i];"; i=$((i+1)); done
if (( n % 2 )); then args+=(-i "$1"); f+="[$i]scale=$w:-1,drawbox=c=black:t=fill[s$i];"; i=$((i+1)); fi
rows=""; r=0
for ((k=0;k<i;k+=2)); do f+="[s$k][s$((k+1))]hstack[r$r];"; rows+="[r$r]"; r=$((r+1)); done
f+="${rows}vstack=inputs=$r"
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "$f" -frames:v 1 "$out"
