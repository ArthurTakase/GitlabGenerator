import urllib.request
from sys import argv

def get_last_version(url):
    try:
        content = str(urllib.request.urlopen(url).read()).split("<")
        content = [content[i].split(">")[1] for i in range(len(content)) if "a href=" in content[i]]
        return content[-1].split("-")[0]
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
            if version is None: 
                try: version = lines[i].split("=")[1].rstrip("\n").split("-")[0]
                except: version = lines[i].split("=")[1].rstrip("\n")
            new_version = f"{update_version(version, index)}-SNAPSHOT" if "release" not in argv else version
            lines[i] = f"version_dep33={new_version}\n"
            break
    with open('gradle.properties', "w") as f: f.writelines(lines)
    print(new_version)

commit_msg = input()

if "MISC" in commit_msg: exit(0)
elif "MAJOR" in commit_msg: edit_file(0)
elif "MINOR" in commit_msg: edit_file(1)
else: edit_file(2)
