class UserParams < ActiveRecord::Migration
  def change
    add_column :users, :remember_token, :string
    add_index  :users, :remember_token
    add_column :users, :firstName, :string
    add_column :users, :lastName, :string
    add_column :users, :role_id, :integer
    add_column :users, :password_digest, :string
    add_column :users, :activation_digest, :string
    add_column :users, :activated, :boolean, default: false
    add_column :users, :activated_at, :datetime
    add_column :users, :reset_digest, :string
    add_column :users, :reset_sent_at, :datetime
  end
end
