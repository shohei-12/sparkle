class AddSelfIntroductionToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :self_introduction, :string, limit: 160
  end
end
