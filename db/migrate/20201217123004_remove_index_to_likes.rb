class RemoveIndexToLikes < ActiveRecord::Migration[6.0]
  def change
    remove_index :likes, :user_id
  end
end
