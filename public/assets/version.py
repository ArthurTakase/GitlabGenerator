import urllib.request
from sys import argv

def get_last_version(url):
    f = urllib.request.urlopen(url)
    content = str(f.read()).rstrip("/>").split("<")
    content = [content[i] for i in range(len(content)) if "a href=" in content[i]]
    content = [content[i].split('">')[1] for i in range(len(content)) if "Parent" not in content[i] and "latest" not in content[i]]
    content.sort()
    if len(content[-1].split("-")) > 1:
        return content[-1].split("-")[0]
    return content[-1]

def update_version(type):
    version = None
    for arg in argv: 
        if "http" in arg: version = get_last_version(arg)

    with open('gradle.properties', "r") as f:
        lines = f.readlines()

        for i in range(len(lines)):
            if "version_dep33=" in lines[i]:
                if version is None:
                    try:
                        version = lines[i].split("=")[1].rstrip("\n").split("-")[0]
                    except:
                        version = lines[i].split("=")[1].rstrip("\n")

                new_version = []
                try: 
                    new_version.append(version.split(".")[0])
                    new_version.append(version.split(".")[1])
                    new_version.append(version.split(".")[2])
                except: 
                    while len(new_version) < 3: new_version.append("0")

                if type == "MINOR": new_version[1] = str(int(new_version[1]) + 1)
                elif type == "MAJOR": new_version[0] = str(int(new_version[0]) + 1)
                else: new_version[2] = str(int(new_version[2]) + 1)

                lines[i] = f"version_dep33={'.'.join(new_version)}{'-SNAPSHOT' if 'release' not in argv else ''}\n"
                print(lines[i])
                break

    with open('gradle.properties', "w") as f: f.writelines(lines)

commit_msg = input()

print("-" * 50)
print(f"Commit message: {commit_msg}")
print(f"Arguments: {argv}")
print("-" * 50)

if "MINOR" in commit_msg: update_version("MINOR")
elif "MAJOR" in commit_msg: update_version("MAJOR")
else: update_version("auto")
