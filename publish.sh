#!/bin/bash
RAILS_ENV=production bundle exec rake assets:clean assets:precompile
>>>>>>> f9178b9bb7af4fbd148e384f9505a1b1fb4db0c9
sudo rm -r /var/www/html/mapspast/*
sudo cp -r /home/mbriggs/rails_projects/mapspast/* /var/www/html/mapspast/
sudo chmod a+rw /var/www/html/mapspast/log/*
sudo service apache2 restart
sudo /etc/rc.local
