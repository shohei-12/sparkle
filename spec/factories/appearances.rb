FactoryBot.define do
  factory :appearance do
    image { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }
    association :record
  end
end
