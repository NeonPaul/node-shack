export DB_USER=root
export DB_PASS=password

# Update repos
sudo apt-get update

# Install mysql
export DEBIAN_FRONTEND="noninteractive"

sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password $DB_PASS"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $DB_PASS"

sudo debconf-set-selections <<< "mysql-community-server mysql-community-server/data-dir select ''"
sudo debconf-set-selections <<< "mysql-community-server mysql-community-server/root-pass password $DB_PASS"
sudo debconf-set-selections <<< "mysql-community-server mysql-community-server/re-root-pass password $DB_PASS"

sudo apt-get install -y -qq mysql-server mysql-client
sudo sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf

#mysql_secure_installation

# configure mysql
mysql -u $DB_USER -p$DB_PASS < /vagrant/shack.sql
mysql -u $DB_USER -p$DB_PASS shack < /vagrant/data.sql
mysql -u $DB_USER -p$DB_PASS mysql -e "update user set host='%' where user='$DB_USER'; flush privileges;"

sudo /etc/init.d/mysql restart
