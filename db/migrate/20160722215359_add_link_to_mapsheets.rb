class AddLinkToMapsheets < ActiveRecord::Migration
  def change
     change_table :mapsheets do |t|
       t.string :dlink
     end

  end
end
