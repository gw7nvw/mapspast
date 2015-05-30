class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :subject
      t.text :message
      t.string :fromName
      t.string :fromEmail
      t.boolean :approved
      t.integer :toUser_id
      t.integer :fromUser_id
      t.integer :forum_id
      t.string  :auth_digest


      t.timestamps
    end
  end
end
