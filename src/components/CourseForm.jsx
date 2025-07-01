import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Loader2, ChevronDown } from 'lucide-react';

const CourseForm = ({ course, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    level: 'beginner',
    thumbnail: '', // will be replaced by thumbnailFile
    modules: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moduleVideos, setModuleVideos] = useState([]); // Array of File[] per module
  const [openModule, setOpenModule] = useState(0); // Accordion state
  const [thumbnailFile, setThumbnailFile] = useState(null); // NEW: for image file

  // Predefined categories and levels
  const categories = [
    'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Marketing', 'Cybersecurity', 'Business', 'Finance', 'Health & Fitness', 'Music', 'Photography', 'Other'
  ];
  const levels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        description: course.description || '',
        price: course.price || '',
        duration: course.duration || '',
        category: course.category || '',
        level: course.level || 'beginner',
        thumbnail: '', // will be handled by thumbnailFile
        modules: course.modules?.map(m => ({
          ...m,
          quizzes: m.quizzes || [],
        })) || []
      });
      setThumbnailFile(null); // reset thumbnail file
      setModuleVideos(course.modules?.map(m => m.videos?.map(v => ({ file: v.url || v, description: v.description || '' })) || []) || []);
    }
  }, [course]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Module logic
  const handleModuleChange = (index, field, value) => {
    const updated = [...formData.modules];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, modules: updated }));
  };
  const addModule = () => {
    setFormData(prev => ({ ...prev, modules: [...prev.modules, { title: '', topics: [''], duration: '', quizzes: [] }] }));
    setModuleVideos(prev => [...prev, []]);
  };
  const removeModule = (index) => {
    setFormData(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
    setModuleVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Video logic
  const handleVideoChange = (moduleIdx, files) => {
    setModuleVideos(prev => {
      const updated = [...prev];
      updated[moduleIdx] = Array.from(files).map(file => ({ file, description: '' }));
      return updated;
    });
  };
  const handleVideoDescriptionChange = (moduleIdx, videoIdx, value) => {
    setModuleVideos(prev => {
      const updated = [...prev];
      if (updated[moduleIdx] && updated[moduleIdx][videoIdx]) {
        updated[moduleIdx][videoIdx].description = value;
      }
      return updated;
    });
  };

  // Quiz logic
  const addQuiz = (moduleIdx) => {
    const updated = [...formData.modules];
    if (!updated[moduleIdx].quizzes) updated[moduleIdx].quizzes = [];
    updated[moduleIdx].quizzes.push({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    setFormData(prev => ({ ...prev, modules: updated }));
  };
  const removeQuiz = (moduleIdx, quizIdx) => {
    const updated = [...formData.modules];
    updated[moduleIdx].quizzes.splice(quizIdx, 1);
    setFormData(prev => ({ ...prev, modules: updated }));
  };
  const handleQuizChange = (moduleIdx, quizIdx, field, value) => {
    const updated = [...formData.modules];
    updated[moduleIdx].quizzes[quizIdx][field] = value;
    setFormData(prev => ({ ...prev, modules: updated }));
  };
  const handleQuizOptionChange = (moduleIdx, quizIdx, optIdx, value) => {
    const updated = [...formData.modules];
    updated[moduleIdx].quizzes[quizIdx].options[optIdx] = value;
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  // Topics logic
  const handleTopicChange = (moduleIdx, topicIdx, value) => {
    const updated = [...formData.modules];
    updated[moduleIdx].topics[topicIdx] = value;
    setFormData(prev => ({ ...prev, modules: updated }));
  };
  const addTopic = (moduleIdx) => {
    const updated = [...formData.modules];
    updated[moduleIdx].topics.push('');
    setFormData(prev => ({ ...prev, modules: updated }));
  };
  const removeTopic = (moduleIdx, topicIdx) => {
    const updated = [...formData.modules];
    updated[moduleIdx].topics.splice(topicIdx, 1);
    setFormData(prev => ({ ...prev, modules: updated }));
  };

  // Thumbnail logic
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setFormData(prev => ({ ...prev, thumbnail: '' })); // clear URL if any
  };

  // Validation (same as before, but for videos/quizzes)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.description.trim()) newErrors.description = 'Course description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Valid duration is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!thumbnailFile) newErrors.thumbnail = 'Thumbnail image is required';
    if (formData.modules.length === 0) newErrors.modules = 'At least one module is required';
    formData.modules.forEach((mod, idx) => {
      if (!mod.title.trim()) newErrors[`module_${idx}_title`] = 'Module title is required';
      if (!mod.duration || mod.duration <= 0) newErrors[`module_${idx}_duration`] = 'Module duration is required';
      if (!mod.topics.length || !mod.topics[0].trim()) newErrors[`module_${idx}_topics`] = 'At least one topic is required';
      if (!moduleVideos[idx] || moduleVideos[idx].length === 0) newErrors[`module_${idx}_videos`] = 'At least one video is required';
      moduleVideos[idx]?.forEach((video, vIdx) => {
        if (!video.description.trim()) newErrors[`module_${idx}_video_${vIdx}_desc`] = 'Video description is required';
      });
      if (mod.quizzes) {
        mod.quizzes.forEach((quiz, qidx) => {
          if (!quiz.question.trim()) newErrors[`module_${idx}_quiz_${qidx}_question`] = 'Question is required';
          quiz.options.forEach((opt, oidx) => {
            if (!opt.trim()) newErrors[`module_${idx}_quiz_${qidx}_option_${oidx}`] = 'Option required';
          });
          if (!quiz.correctAnswer.trim()) newErrors[`module_${idx}_quiz_${qidx}_correct`] = 'Correct answer required';
        });
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Check if we have any files to upload
      const hasFiles = thumbnailFile || moduleVideos.some(videos => videos && videos.length > 0);
      
      if (hasFiles) {
        // Use FormData for file uploads
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('price', formData.price);
        fd.append('duration', formData.duration);
        fd.append('category', formData.category);
        fd.append('level', formData.level);
        if (thumbnailFile) fd.append('thumbnail', thumbnailFile);
        
        // Prepare modules (without videos)
        const modulesForBackend = formData.modules.map((mod, idx) => {
          const { videos, ...rest } = mod;
          return rest;
        });
        fd.append('modules', JSON.stringify(modulesForBackend));
        
        // Send all videos with a single field name 'videos' and include module index in description
        moduleVideos.forEach((videos, moduleIdx) => {
          if (videos && videos.length > 0) {
            videos.forEach((video, videoIdx) => {
              if (video.file instanceof File) {
                fd.append('videos', video.file);
                // Include module index and video index in description for backend to parse
                const videoInfo = {
                  moduleIndex: moduleIdx,
                  videoIndex: videoIdx,
                  description: video.description
                };
                fd.append('videoDescriptions', JSON.stringify(videoInfo));
              }
            });
          }
        });
        
        // Debug: Log what's being sent
        console.log('=== FRONTEND DEBUG (FormData) ===');
        console.log('FormData contents:');
        for (let [key, value] of fd.entries()) {
          console.log(`${key}:`, value);
        }
        console.log('========================');
        
        await onSubmit(fd);
      } else {
        // Use JSON for data without files
        const courseData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          category: formData.category,
          level: formData.level,
          modules: formData.modules.map((mod, idx) => {
            const { videos, ...rest } = mod;
            return {
              ...rest,
              duration: parseInt(rest.duration)
            };
          })
        };
        
        // Debug: Log what's being sent
        console.log('=== FRONTEND DEBUG (JSON) ===');
        console.log('JSON data:', courseData);
        console.log('========================');
        
        await onSubmit(courseData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Accordion toggle
  const toggleModule = idx => setOpenModule(openModule === idx ? -1 : idx);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
              <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter course name" disabled={isSubmitting} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select value={formData.category} onChange={e => handleInputChange('category', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300'}`} disabled={isSubmitting}>
                <option value="">Select category</option>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.price ? 'border-red-500' : 'border-gray-300'}`} placeholder="0.00" disabled={isSubmitting} />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours) *</label>
              <input type="number" min="1" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.duration ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 24" disabled={isSubmitting} />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
              <select value={formData.level} onChange={e => handleInputChange('level', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" disabled={isSubmitting}>
                {levels.map(level => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image *</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'}`} disabled={isSubmitting} />
              {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
              {thumbnailFile && <p className="text-xs text-gray-500 mt-1">Selected: {thumbnailFile.name}</p>}
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
            <textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={4} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Describe what students will learn in this course..." disabled={isSubmitting} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          {/* Modules Accordion */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Course Modules *</label>
              <button type="button" onClick={addModule} className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium" disabled={isSubmitting}>
                <Plus className="h-4 w-4 mr-1" /> Add Module
              </button>
            </div>
            {errors.modules && <p className="text-red-500 text-sm mb-4">{errors.modules}</p>}
            <div className="space-y-4">
              {formData.modules.map((module, moduleIdx) => (
                <div key={moduleIdx} className="border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleModule(moduleIdx)}>
                    <div className="font-medium text-gray-900">Module {moduleIdx + 1}: {module.title || <span className='italic text-gray-400'>Untitled</span>}</div>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={e => { e.stopPropagation(); removeModule(moduleIdx); }} className="text-red-500 hover:text-red-700 transition-colors" disabled={isSubmitting}><Trash2 className="h-4 w-4" /></button>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openModule === moduleIdx ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {openModule === moduleIdx && (
                    <div className="p-4 space-y-4 border-t border-gray-100 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Module Title *</label>
                          <input type="text" value={module.title} onChange={e => handleModuleChange(moduleIdx, 'title', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors[`module_${moduleIdx}_title`] ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Introduction to React" disabled={isSubmitting} />
                          {errors[`module_${moduleIdx}_title`] && <p className="text-red-500 text-sm mt-1">{errors[`module_${moduleIdx}_title`]}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                          <input type="number" min="1" value={module.duration} onChange={e => handleModuleChange(moduleIdx, 'duration', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors[`module_${moduleIdx}_duration`] ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 180" disabled={isSubmitting} />
                          {errors[`module_${moduleIdx}_duration`] && <p className="text-red-500 text-sm mt-1">{errors[`module_${moduleIdx}_duration`]}</p>}
                        </div>
                      </div>
                      {/* Topics */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Topics *</label>
                          <button type="button" onClick={() => addTopic(moduleIdx)} className="text-sm text-indigo-600 hover:text-indigo-800" disabled={isSubmitting}><Plus className="h-3 w-3 inline mr-1" /> Add Topic</button>
                        </div>
                        {errors[`module_${moduleIdx}_topics`] && <p className="text-red-500 text-sm mb-2">{errors[`module_${moduleIdx}_topics`]}</p>}
                        <div className="space-y-2">
                          {module.topics.map((topic, topicIdx) => (
                            <div key={topicIdx} className="flex items-center space-x-2">
                              <input type="text" value={topic} onChange={e => handleTopicChange(moduleIdx, topicIdx, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="e.g., React Components" disabled={isSubmitting} />
                              {module.topics.length > 1 && <button type="button" onClick={() => removeTopic(moduleIdx, topicIdx)} className="text-red-500 hover:text-red-700 transition-colors" disabled={isSubmitting}><Trash2 className="h-4 w-4" /></button>}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Videos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Module Videos *</label>
                        <input type="file" accept="video/*" multiple onChange={e => handleVideoChange(moduleIdx, e.target.files)} className="w-full" disabled={isSubmitting} />
                        {errors[`module_${moduleIdx}_videos`] && <p className="text-red-500 text-sm mt-1">{errors[`module_${moduleIdx}_videos`]}</p>}
                        <div className="mt-2 flex flex-col gap-2">
                          {moduleVideos[moduleIdx]?.length > 0 && moduleVideos[moduleIdx].map((video, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                                {video.file.name || (typeof video.file === 'string' ? video.file : 'Video')}
                              </span>
                              <input
                                type="text"
                                placeholder="Video Description"
                                value={video.description}
                                onChange={e => handleVideoDescriptionChange(moduleIdx, i, e.target.value)}
                                className={`flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs ${errors[`module_${moduleIdx}_video_${i}_desc`] ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={isSubmitting}
                              />
                              {errors[`module_${moduleIdx}_video_${i}_desc`] && <span className="text-red-500 text-xs ml-1">*</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Quizzes */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Quizzes</label>
                          <button type="button" onClick={() => addQuiz(moduleIdx)} className="text-sm text-indigo-600 hover:text-indigo-800" disabled={isSubmitting}><Plus className="h-3 w-3 inline mr-1" /> Add Quiz</button>
                        </div>
                        {module.quizzes?.length > 0 && module.quizzes.map((quiz, quizIdx) => (
                          <div key={quizIdx} className="border border-gray-200 rounded-lg p-3 mb-2 bg-white">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-800">Question {quizIdx + 1}</span>
                              <button type="button" onClick={() => removeQuiz(moduleIdx, quizIdx)} className="text-red-500 hover:text-red-700 transition-colors" disabled={isSubmitting}><Trash2 className="h-4 w-4" /></button>
                            </div>
                            <input type="text" value={quiz.question} onChange={e => handleQuizChange(moduleIdx, quizIdx, 'question', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors[`module_${moduleIdx}_quiz_${quizIdx}_question`] ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter question" disabled={isSubmitting} />
                            {errors[`module_${moduleIdx}_quiz_${quizIdx}_question`] && <p className="text-red-500 text-sm mt-1">{errors[`module_${moduleIdx}_quiz_${quizIdx}_question`]}</p>}
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {quiz.options.map((opt, optIdx) => (
                                <input key={optIdx} type="text" value={opt} onChange={e => handleQuizOptionChange(moduleIdx, quizIdx, optIdx, e.target.value)} className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors[`module_${moduleIdx}_quiz_${quizIdx}_option_${optIdx}`] ? 'border-red-500' : 'border-gray-300'}`} placeholder={`Option ${optIdx + 1}`} disabled={isSubmitting} />
                              ))}
                            </div>
                            <div className="mt-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Correct Answer</label>
                              <input type="text" value={quiz.correctAnswer} onChange={e => handleQuizChange(moduleIdx, quizIdx, 'correctAnswer', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors[`module_${moduleIdx}_quiz_${quizIdx}_correct`] ? 'border-red-500' : 'border-gray-300'}`} placeholder="Correct answer" disabled={isSubmitting} />
                              {errors[`module_${moduleIdx}_quiz_${quizIdx}_correct`] && <p className="text-red-500 text-sm mt-1">{errors[`module_${moduleIdx}_quiz_${quizIdx}_correct`]}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors" disabled={isSubmitting}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />{isEditing ? 'Updating...' : 'Creating...'}</>) : (<><Save className="h-5 w-5 mr-2" />{isEditing ? 'Update Course' : 'Create Course'}</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm; 