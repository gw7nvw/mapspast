class CreateMapseries < ActiveRecord::Migration
  def change
    create_table :mapseries do |t|
      t.string :name
      t.integer :year_of_snapshot
      t.string :series
      t.string :edition
      t.string :details
      t.integer :scale
      t.integer  :createdBy_id

      t.timestamps
    end
  end
end
