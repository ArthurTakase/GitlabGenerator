import urllib.request
from sys import argv

def get_last_version(url):
    try:
        content = str(urllib.request.urlopen(url).read()).split("<")
        content = [content[i].split(">")[1] for i in range(len(content)) if "a href=" in content[i]]
        return content[-1].replace("-SNAPSHOT", "")
    except: return None

def update_version(version, index):
    new_version = version.split('.', 3)
    while len(new_version) < 3: new_version.append("0")
    new_version[index] = str(int(new_version[index]) + 1)
    return '.'.join(new_version)

def edit_file(index, version = None):
    for arg in argv: 
        if "http" in arg: version = get_last_version(arg)
    with open('gradle.properties', "r") as f:
        lines = f.readlines()
        for i in range(len(lines)):
            if "version_dep33=" not in lines[i]: continue
            if version is None: version = lines[i].split("=")[1].rstrip("\n").replace("-SNAPSHOT", "")
            lines[i] = f"version_dep33={update_version(version, index)}-SNAPSHOT\n" if "release" not in argv else f"version_dep33={version}\n"
            print(lines[i].rstrip("\n"))
            break
    with open('gradle.properties', "w") as f: f.writelines(lines)

commit_msg = input()

if "MAJOR" in commit_msg: edit_file(0)
elif "MINOR" in commit_msg: edit_file(1)
else: edit_file(2)