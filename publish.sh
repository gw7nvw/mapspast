#!/bin/bash
RAILS_ENV=production rake assets:clean assets:precompile
sudo rm -r /var/www/html/mapspast/*
sudo cp -r /home/mbriggs/rails_projects/mapspast/* /var/www/html/mapspast/
sudo chmod a+rw /var/www/html/mapspast/log/*
sudo service apache2 restart
sudo /etc/rc.local
