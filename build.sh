echo "building awl...."
PLATFORM = $(uname -s | tr '[:upper:]' '[:lower:]')
if [ "$PLATFORM" = "darwin" ]; then
	 echo "Detected macOS platform. Please use a Linux or Windows machine to build the awl binary."
   exit 1
fi
bun build --compile main.ts --outfile awl 
bun build --compile main.ts --outfile awl-win.exe --target=bun-windows-x64
echo "build complete."
echo "awl binary has been saved as awl (linux binary) and awl-win.exe (windows binary)."
