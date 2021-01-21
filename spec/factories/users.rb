FactoryBot.define do
  factory :user do
    name { 'test' }
    sequence(:email) { |n| "test#{n}@example.com" }
    self_introduction { 'This is a test.' }
    password { 'password' }
    password_confirmation { 'password' }
    theme { 'light' }
  end
end
