import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mentors } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { 
  User, 
  Clock, 
  ThumbsUp, 
  Megaphone, 
  CheckCircle, 
  ArrowLeft,
  Coffee,
  Briefcase,
  TrendingUp,
  Globe,
  FileText,
  Leaf,
  Star,
  X
} from 'lucide-react';

const MentorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mentor = mentors.find(m => m.id === parseInt(id));
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mentor) {
    navigate('/mentor');
    return null;
  }

  // Sample mentor expectations and additional data
  const mentorData = {
    ...mentor,
    expectations: {
      greeting: "Congratulations in taking the step in making a change in your life. Imagine living the life you always dream. You can achieve it.",
      points: [
        "Be open to learn new tools and techniques to change your life.",
        "Do the exercise that is emailed to you.",
        "Consistently communicate and write back your comments."
      ],
      quotes: [
        "Just as our eyes need light in order to see, our minds need ideas in order to conceive.",
        "Don't wait. The time will never be just right."
      ],
      closing: "To your success and happiness. " + mentor.name
    },
    stats: {
      memberSince: "almost 11 years",
      likes: 3,
      reviews: 4,
      mentored: 5
    },
    reviews: [
      {
        text: "i havent heard in 2 yrs",
        author: "Anonymous"
      }
    ],
    bio: "I am a master Neuro-linguistic Programmer (NLP) and Time Line Therapist. For over a decade I was a individual and relationship counselor, business and personal growth seminar presenter, and business coach. My company is Successful Living Institute (website is www.successfullivinginstitute.com). Currently I am semi retired. I would like volunteer as a mentor to help people to live a happy, peaceful, successful and fulfilling life."
  };

  const handleMentorRequest = () => {
    setShowMessageModal(true);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowMessageModal(false);
      setMessage('');
      alert('Mentor request sent successfully!');
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner with Doodles */}
      <div className="relative bg-gradient-to-r from-amber-100 to-amber-200 h-56 md:h-64 overflow-visible">
        {/* Doodle Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16 opacity-60">
          {/* Left side doodles */}
          <div className="flex items-center space-x-8">
            <Coffee size={32} className="text-amber-700" />
            <Briefcase size={28} className="text-amber-700" />
            <div className="flex items-center space-x-2">
              <TrendingUp size={24} className="text-amber-700" />
              <span className="text-amber-800 font-bold text-sm">SUCCESS</span>
            </div>
          </div>
          
          {/* Center doodles */}
          <div className="flex items-center space-x-4">
            <Globe size={24} className="text-amber-700" />
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              <ArrowLeft size={16} className="text-amber-700" />
              <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              <ArrowLeft size={16} className="text-amber-700" />
              <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
            </div>
          </div>
          
          {/* Right side doodles */}
          <div className="flex items-center space-x-6">
            <FileText size={24} className="text-amber-700" />
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-amber-700 rounded text-white text-xs flex items-center justify-center">3</div>
              <div className="w-4 h-4 bg-amber-700 rounded text-white text-xs flex items-center justify-center">4</div>
            </div>
            <Leaf size={20} className="text-amber-700" />
          </div>
        </div>

        {/* Profile Picture */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
          <img 
            src={mentor.image} 
            alt={mentor.name}
            className="w-36 h-36 md:w-44 md:h-44 rounded-xl object-cover border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/mentor')}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              Back to Mentors
            </button>

            {/* Mentor Name and Title */}
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-gray-600" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{mentor.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Life & Personal Development Mentor</p>
              </div>
            </div>


            {/* Biography */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                {mentorData.bio}
              </p>
            </div>

            {/* What I Expect From A Mentee */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
                What I Expect From A Mentee:
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {mentorData.expectations.greeting}
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  {mentorData.expectations.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                <div className="space-y-3 mt-6">
                  {mentorData.expectations.quotes.map((quote, index) => (
                    <blockquote key={index} className="italic text-gray-600 border-l-4 border-emerald-500 pl-4">
                      "{quote}"
                    </blockquote>
                  ))}
                </div>

                <p className="text-gray-700 font-medium mt-6">
                  {mentorData.expectations.closing}
                </p>
              </div>
            </div>

            {/* More About This Mentor */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
                More About This Mentor:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock size={20} className="text-emerald-600" />
                  <span className="text-gray-700">Member since {mentorData.stats.memberSince}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <ThumbsUp size={20} className="text-emerald-600" />
                  <span className="text-gray-700">{mentorData.stats.likes} likes from mentees</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Megaphone size={20} className="text-emerald-600" />
                  <span className="text-gray-700">Got {mentorData.stats.reviews} reviews</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle size={20} className="text-emerald-600" />
                  <span className="text-gray-700">Mentored {mentorData.stats.mentored} people in the past</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">
                Reviews From {mentorData.stats.reviews} Mentees:
              </h2>
              <div className="space-y-4">
                {mentorData.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl text-gray-400">"</div>
                      <div>
                        <p className="text-gray-700 italic">{review.text}</p>
                        <p className="text-gray-500 text-sm mt-2">- {review.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 lg:pl-4">
            <div className="sticky top-8 space-y-6">

              {/* Request Button */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 mb-4 text-center">
                  Interested in this mentor?
                </p>
                <button 
                  onClick={handleMentorRequest}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  <Star size={20} />
                  Request to get mentored
                </button>
              </div>

              {/* Mentor Stats */}
              <div className="bg-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-600 font-semibold">{mentor.rating}</span>
                      <Star size={16} className="text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="text-gray-900 font-semibold">{mentor.reviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="text-gray-900 font-semibold">₹{mentor.price}/session</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spots Left</span>
                    <span className="text-emerald-600 font-semibold">{mentor.spotsLeft}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Send Mentoring Request</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to {mentor.name}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell them why you'd like to be mentored and what you hope to achieve..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MentorProfile;
