from subprocess import Popen
import glob

tests = glob.glob('test*.py')
processes = []
for test in tests:
    processes.append(Popen('python %s' % test, shell=True))

for process in processes:
    process.wait()