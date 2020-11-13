require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user1) { build(:user1) }

  describe 'name' do
    context 'when empty' do
      before { user1.name = '' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when over 20 characters' do
      before { user1.name = 'a' * 21 }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end
  end

  describe 'email' do
    context 'when empty' do
      before { user1.email = '' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when over 256 characters' do
      before { user1.email = 'a' * 245 + '@example.com' }

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when duplication' do
      before do
        create(:user2)
        user1.email = 'user2@example.com'
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when format is incorrect' do
      it 'return false' do
        [
          'a_B6.@@ac8.com',
          'YSujfa.net',
          'gh+o-@ac:.jp',
          'ty@rrvb',
          'ewL@ki.net6',
          'vlae@fa.'
        ].each do |invalid_email|
          user1.email = invalid_email
          expect(user1.valid?).to eq false
        end
      end
    end
  end

  describe 'password' do
    context 'when empty' do
      before do
        user1.password = ''
        user1.password_confirmation = ''
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when less than 6 characters' do
      before do
        user1.password = 'a' * 5
        user1.password_confirmation = 'a' * 5
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when not match with confirmation password' do
      before do
        user1.password = 'passwor'
      end

      it 'return false' do
        expect(user1.valid?).to eq false
      end
    end

    context 'when format is incorrect' do
      it 'return false' do
        [
          'ajlV9@',
          '+98_g-T',
          'gal^e3'
        ].each do |invalid_password|
          user1.password = invalid_password
          user1.password_confirmation = invalid_password
          expect(user1.valid?).to eq false
        end
      end
    end
  end
end
