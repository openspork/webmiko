# Webmiko is a web GUI for Netmiko, a Python module that issues commands to SSH network equipment using the Python Paramiko module

## Features
* Device library, each which can be assigned arbitrary variables -- think username, password, IP address, port numbers, etc.
* Smart variable value expansion -- i.e. 1-4 will enumerate to [1, 2, 3, 4] so as to intelligently expand permutations
* Command shell with two execute buttons -- one for read-only queries (for which blacklisted strings can be defined) and a read-write.
* A history of all commands
* The ability to "favorite" certain commands
* Perhaps more, but I shouldn't get ahead of myself :)
