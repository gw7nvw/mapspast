class AddServerpathToUploadedmap < ActiveRecord::Migration
  def change
    change_table :uploadedmaps do |t|
      t.string :serverpath
    end
  end
end
