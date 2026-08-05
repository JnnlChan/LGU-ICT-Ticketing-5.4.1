#!/bin/bash
find src/components -type f -name "*.tsx" -exec sed -i \
  -e 's/bg-bg0/bg-white\/10/g' \
  -e 's/bg-slate-800/bg-white\/10/g' \
  -e 's/bg-slate-600/bg-white\/10/g' \
  -e 's/ring-slate-100/ring-border/g' \
  -e 's/divide-slate-50/divide-white\/5/g' \
  {} +
