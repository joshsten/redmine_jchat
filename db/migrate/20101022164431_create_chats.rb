class CreateChats < ActiveRecord::Migration
  def self.up
    create_table :chats do |t|
      t.column :message, :string
      t.column :user, :integer
      t.column :created_at, :timestamp
    end
  end

  def self.down
    drop_table :chats
  end
end
