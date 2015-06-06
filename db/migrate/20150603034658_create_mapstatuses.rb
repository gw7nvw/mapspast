class CreateMapstatuses < ActiveRecord::Migration
  def change
    create_table :mapstatuses do |t|
      t.string :name
    end
  end
end
