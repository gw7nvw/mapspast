# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150530214755) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "authlists", force: true do |t|
    t.string   "address"
    t.string   "name"
    t.boolean  "allow",       default: false
    t.boolean  "forbid",      default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "auth_digest"
  end

  create_table "mapseries", force: true do |t|
    t.string   "name"
    t.integer  "year_of_snapshot"
    t.string   "series"
    t.string   "edition"
    t.string   "details"
    t.integer  "scale"
    t.integer  "createdBy_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mapsheets", force: true do |t|
    t.string   "name"
    t.integer  "series_id"
    t.integer  "year_printed"
    t.integer  "year_revised"
    t.integer  "scale"
    t.string   "series"
    t.string   "sheet"
    t.string   "edition"
    t.string   "details"
    t.integer  "source_srid"
    t.decimal  "xleft"
    t.decimal  "xright"
    t.decimal  "ytop"
    t.decimal  "ybottom"
    t.integer  "createdBy_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.spatial  "extent",       limit: {:srid=>4326, :type=>"polygon"}
  end

  create_table "messages", force: true do |t|
    t.string   "subject"
    t.text     "message"
    t.string   "fromName"
    t.string   "fromEmail"
    t.boolean  "approved"
    t.integer  "toUser_id"
    t.integer  "fromUser_id"
    t.integer  "forum_id"
    t.string   "auth_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "projections", force: true do |t|
    t.string   "name"
    t.string   "proj4"
    t.string   "wkt"
    t.integer  "epsg"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.string   "firstName"
    t.string   "lastName"
    t.integer  "role_id"
    t.string   "password_digest"
    t.string   "activation_digest"
    t.boolean  "activated",         default: false
    t.datetime "activated_at"
    t.string   "reset_digest"
    t.datetime "reset_sent_at"
  end

  add_index "users", ["remember_token"], :name => "index_users_on_remember_token"

end
