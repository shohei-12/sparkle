FactoryBot.define do
  factory :meal do
    image { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }
    meal_type { 'breakfast' }
    association :record
  end
end
