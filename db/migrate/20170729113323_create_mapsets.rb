class CreateMapsets < ActiveRecord::Migration
  def change
    create_table :mapsets do |t|
      t.string :name
      t.string :details
      t.string :publisher
      t.string :copyright

      t.timestamps
    end
  end
end
