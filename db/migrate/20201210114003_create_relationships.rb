class CreateRelationships < ActiveRecord::Migration[6.0]
  def change
    create_table :relationships do |t|
      t.references :user, null: false, foreign_key: true, index: false
      t.references :follow, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :relationships, %i[user_id follow_id], unique: true
  end
end
