import time
import requests
import sys
import select
from SF_9DOF import IMU
#create IMU object 
imu = IMU()

#Initialize IMU
imu.initialize()

imu.enable_accel()

imu.read_accel()

imu.accel_range("16G")
accel_x = []
accel_y = []
accel_z = []

#t_end = time.time() + 1
#while(imu.ax.size < 700):
accel_x.append(imu.ax)
accel_y.append(imu.ay)
accel_z.append(imu.az)

def start_checker():
    if select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], []):
        c = sys.stdin.read(1)
        return c
        
while (len(accel_x) < 1700):
    accel_x.append(imu.ax)
    accel_y.append(imu.ay)
    accel_z.append(imu.az)
    accel_x.append(imu.ax)
    accel_y.append(imu.ay)
    accel_z.append(imu.az)
#    print start_checker()
#    if (start_checker() == 'o'):
#        print 'non blocking input worked'
#sys.stdout.write('hello\n')
#while (1): 
#    start_checker()
#    if (start_checker() == 'o'):
#        print 'non blocking input is working'

    #import pdb; pdb.set_trace()
data = {'accelx':accel_x,
        'accely':accel_y,
        'accelz':accel_z}


url = 'https://obscure-headland-45385.herokuapp.com/swings'
import warnings; warnings.filterwarnings('ignore')
requests.post(url, json=data)
