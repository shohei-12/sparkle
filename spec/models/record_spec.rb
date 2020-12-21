require 'rails_helper'

RSpec.describe Record, type: :model do
  let(:record1) { build(:record) }
  let(:record2) { create(:record) }
  let(:user) { create(:user) }

  it 'return true' do
    expect(record1.valid?).to eq true
  end

  describe 'date' do
    context 'when empty' do
      before { record1.date = '' }

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end
  end

  describe 'user_id' do
    context 'when empty' do
      before { record1.user_id = '' }

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { record1.user_id += 1 }

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end

    context 'when duplicate combination of user_id and date' do
      before do
        record1.user_id = record2.user_id
        record1.date = record2.date
      end

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end
  end

  describe '#liked_by?(current_user)' do
    context 'when liked' do
      before { user.like(record2) }

      it 'return true' do
        expect(record2.liked_by?(user)).to eq true
      end
    end

    context 'when not liked' do
      it 'return false' do
        expect(record2.liked_by?(user)).to eq false
      end
    end
  end
end
