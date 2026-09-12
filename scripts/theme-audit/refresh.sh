#!/usr/bin/env bash
# Rebuild, restart the production server, and re-capture CSS + every route's SSR HTML
# so the contrast audit always runs against the current code.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE/../.."
S="$HERE/.work"
mkdir -p "$S"
PORT_N=4321

if [ "${1:-}" = "build" ]; then
  echo "== building =="
  npx next build > "$S/build.log" 2>&1 || { echo "BUILD FAILED"; tail -30 "$S/build.log"; exit 1; }
  echo "build ok"
fi

# collect the compiled CSS
cat .next/static/chunks/*.css > "$S/built.css"
echo "css: $(wc -c < "$S/built.css") bytes"

# (re)start the prod server
for pid in $(powershell.exe -NoProfile -Command "(Get-NetTCPConnection -State Listen -LocalPort $PORT_N -ErrorAction SilentlyContinue).OwningProcess" 2>/dev/null | tr -d '\r'); do
  [ -n "$pid" ] && powershell.exe -NoProfile -Command "Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue" >/dev/null 2>&1
done
sleep 2
(PORT=$PORT_N npx next start -p $PORT_N > "$S/prod.log" 2>&1 &)
for i in $(seq 1 40); do
  c=$(curl -s -o /dev/null -m 3 -w "%{http_code}" "http://localhost:$PORT_N/" 2>/dev/null)
  [ "$c" = "200" ] && break
done
echo "server: $c"

mkcookie() { node -e "console.log('jks_mock_session=' + encodeURIComponent(JSON.stringify({email:process.argv[1],name:process.argv[2],initials:process.argv[3],role:process.argv[4]})))" "$1" "$2" "$3" "$4"; }
ADMIN=$(mkcookie "lexonitservices@gmail.com" "Lexon Administrator" "LX" "admin")
INST=$(mkcookie "faculty@jkslearning.dev" "Ravi Kumar" "RK" "instructor")
STU=$(mkcookie "student@jkslearning.dev" "Asha Nair" "AN" "student")

rm -rf "$S/pages"; mkdir -p "$S/pages"
fetch() { # $1 route  $2 cookie
  f=$(echo "$1" | sed 's#/#_#g')
  code=$(curl -s -m 40 ${2:+-H "Cookie: $2"} -o "$S/pages/$f.html" -w "%{http_code}" "http://localhost:$PORT_N$1")
  [ "$code" != "200" ] && echo "  !! $code $1"
}
for r in / /courses /about /ai-mock-interview /success-stories /login /register /terms /privacy-policy /privacy /register-course /forgot-password; do fetch "$r" ""; done
for r in /admin /admin/students /admin/courses /admin/courses/new /admin/settings /admin/payments /admin/analytics /admin/certificates /admin/instructors /admin/assessments /admin/assessments/questions /admin/leads /admin/ai-interviews; do fetch "$r" "$ADMIN"; done
for r in /instructor /instructor/students /instructor/courses /instructor/courses/new /instructor/analytics /instructor/settings /instructor/profile /instructor/assessments; do fetch "$r" "$INST"; done
for r in /dashboard /dashboard/my-courses /dashboard/certificates /dashboard/payments /dashboard/profile /dashboard/leaderboard /dashboard/quizzes /dashboard/bookmarks /dashboard/assessments /dashboard/courses /dashboard/playground /dashboard/resume-builder /dashboard/ai-interview; do fetch "$r" "$STU"; done
echo "pages: $(ls "$S/pages" | wc -l)"
