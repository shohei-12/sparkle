class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :record, null: false, foreign_key: true
      t.string :target, null: false
      t.bigint :reply_comment_id
      t.bigint :reply_user_id

      t.timestamps
    end
  end
end
