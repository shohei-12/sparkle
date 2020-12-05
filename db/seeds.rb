# eating_times
EatingTime.create!([
                     { name: 'breakfast' },
                     { name: 'lunch' },
                     { name: 'dinner' },
                     { name: 'snack' }
                   ])

# main user
User.create!(
  profile: open("#{Rails.root}/db/fixtures/profile.jpg"),
  name: 'shohei',
  email: 'shohei@example.com',
  password: 'password',
  password_confirmation: 'password',
  theme: 'light'
)

# sub user
4.times do |n|
  User.create!(
    name: Faker::Name.unique.name,
    email: "sub#{n + 1}@example.com",
    password: 'password',
    password_confirmation: 'password',
    theme: 'light'
  )
end

# records
[1, 2, 3, 4, 5].each do |i|
  20.times do |n|
    Record.create!(
      date: Date.new(2021, 1, n + 1),
      appearance: open("#{Rails.root}/db/fixtures/appearances/appearance#{rand(1..5)}.jpg"),
      user_id: i
    )
  end
end

# appearances
100.times do |i|
  5.times do |n|
    Appearance.create!(
      image: open("#{Rails.root}/db/fixtures/appearances/appearance#{n + 1}.jpg"),
      record_id: i + 1
    )
  end
end

# meals
100.times do |i|
  3.times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/breakfasts/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 1
    )
  end
  3.times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/lunchs/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 2
    )
  end
  3.times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/dinners/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 3
    )
  end
  3.times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/snacks/meal#{n + 1}.jpg"),
      record_id: i + 1,
      eating_time_id: 4
    )
  end
end
