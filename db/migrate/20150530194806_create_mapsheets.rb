class CreateMapsheets < ActiveRecord::Migration
  def change
    create_table :mapsheets do |t|
      t.string :name
      t.integer :series_id
      t.integer :year_printed
      t.integer :year_revised
      t.integer :scale
      t.string :series
      t.string :sheet
      t.string :edition
      t.string :details
      t.integer :source_srid
      t.decimal :xleft
      t.decimal :xright
      t.decimal :ytop
      t.decimal :ybottom
      t.polygon :extent, :spatial => true, :srid => 4326
      t.integer  :createdBy_id

      t.timestamps
    end
  end
end
