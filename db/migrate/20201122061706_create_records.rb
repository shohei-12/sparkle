class CreateRecords < ActiveRecord::Migration[6.0]
  def change
    create_table :records do |t|
      t.date :date, null: false
      t.references :user, null: false, foreign_key: true, index: false

      t.timestamps
    end

    add_index :records, %i[user_id date], unique: true
  end
end
