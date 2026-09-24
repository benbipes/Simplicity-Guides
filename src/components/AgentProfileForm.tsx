import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  CheckCircle,
  Building2,
  User,
  Phone,
  Mail,
  Globe,
  FileBadge,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Save,
  RotateCcw,
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { AgentProfile, BrandingOptions } from '../types';
import { generateSampleLogoDataUrl } from '../utils/helpers';

interface AgentProfileFormProps {
  profile: AgentProfile;
  onChange: (updated: AgentProfile) => void;
  options: BrandingOptions;
  onOptionsChange: (updated: BrandingOptions) => void;
  onSave: () => void;
  onReset: () => void;
  saveStatus: string | null;
}

export const AgentProfileForm: React.FC<AgentProfileFormProps> = ({
  profile,
  onChange,
  options,
  onOptionsChange,
  onSave,
  onReset,
  saveStatus,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const disclosureInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'disclosure'>('profile');

  const handleFieldChange = (field: keyof AgentProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleSocialChange = (network: keyof AgentProfile['socialLinks'], value: string) => {
    onChange({
      ...profile,
      socialLinks: {
        ...profile.socialLinks,
        [network]: value,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleFieldChange('logoDataUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDisclosureFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt');

    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      handleFieldChange('uploadedDisclosure', {
        fileName: file.name,
        fileType: 'pdf',
        pdfBytes,
      });
    } else if (isImage) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleFieldChange('uploadedDisclosure', {
          fileName: file.name,
          fileType: 'image',
          dataUrl: evt.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else if (isText) {
      const text = await file.text();
      handleFieldChange('disclaimer', text);
      handleFieldChange('uploadedDisclosure', {
        fileName: file.name,
        fileType: 'text',
      });
    } else {
      alert('Please upload a PDF, image, or text file for your disclosure.');
    }
  };

  const handleRemoveDisclosure = () => {
    handleFieldChange('uploadedDisclosure', null);
    if (disclosureInputRef.current) {
      disclosureInputRef.current.value = '';
    }
  };

  const handleGenerateSampleLogo = () => {
    const sample = generateSampleLogoDataUrl(profile.company || 'Sterling Crest', '#0076BD');
    handleFieldChange('logoDataUrl', sample);
  };

  const handleRemoveLogo = () => {
    handleFieldChange('logoDataUrl', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header with Tab Navigation */}
      <div className="border-b border-slate-200 bg-[#E6E6E6]/30 p-4 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#004372]">Agent Branding Profile</h2>
            <p className="text-xs text-slate-500">Logo applied to Cover (lower left), Contact Page, and Disclosure Page</p>
          </div>
          <div className="flex items-center space-x-2">
            {saveStatus && (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {saveStatus}
              </span>
            )}
            <button
              onClick={onSave}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#0076BD] hover:bg-[#00629e] text-white shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save
            </button>
          </div>
        </div>

        {/* Tab Buttons (No color offerings per user instruction) */}
        <div className="flex space-x-1 border-b border-slate-200 -mb-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. Logo & Contact Info
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-2 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'social'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            2. Social Media Links
          </button>
          <button
            onClick={() => setActiveTab('disclosure')}
            className={`py-2 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'disclosure'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            3. Upload Disclosure
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

        {/* TAB 1: LOGO & CONTACT INFO */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {/* Logo Upload Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Agent / Agency Logo *
                </label>
                <span className="text-[11px] text-[#0076BD] font-semibold">
                  Placed in 3 spots automatically
                </span>
              </div>
              <div className="p-3.5 bg-[#E6E6E6]/40 border border-dashed border-slate-300 rounded-xl flex items-center space-x-4">
                {profile.logoDataUrl ? (
                  <div className="relative group w-32 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 overflow-hidden shadow-xs">
                    <img
                      src={profile.logoDataUrl}
                      alt="Uploaded Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      title="Remove logo"
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-16 bg-slate-200/80 rounded-lg flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
                    <span className="text-[10px]">No Logo</span>
                  </div>
                )}

                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    {profile.logoDataUrl ? 'Replace Logo' : 'Upload PNG / JPG'}
                  </button>
                  
                  <button
                    onClick={handleGenerateSampleLogo}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#0076BD]/30 text-[#0076BD] hover:bg-[#0076BD]/10 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Sample Logo
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Stamps into: <strong>1. Cover lower-left corner</strong>, <strong>2. Contact page center</strong>, and <strong>3. Disclosure page</strong>.
              </p>
            </div>

            {/* Advisor Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Advisor Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Marcus Sterling, CFP®"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Agency / Firm Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => handleFieldChange('company', e.target.value)}
                    placeholder="e.g. Sterling Crest Financial"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL (Replaces businessgroup.com) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0076BD]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    placeholder="e.g. https://www.sterlingcrestfp.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none font-semibold text-[#004372]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Phone (Clickable in PDF) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="e.g. (555) 782-4190"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Clickable mailto:) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="e.g. advisor@sterlingcrestfp.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  "Learn More" Review Button Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={profile.bookingUrl || ''}
                    onChange={(e) => handleFieldChange('bookingUrl', e.target.value)}
                    placeholder="e.g. https://calendly.com/your-firm/review"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Office Address (Replaces 000 Meeting Street...) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="e.g. 400 North Michigan Avenue, Suite 1800, Chicago, IL 60611"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOCIAL MEDIA & CHANNELS */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="bg-[#004372]/5 border border-[#004372]/15 rounded-xl p-3.5 text-xs text-[#004372]">
              <strong>Exact PDF Social Icons:</strong> The 5 circular icons at the bottom of the contact page (YouTube, Instagram, Facebook, LinkedIn, X) will be wired directly to your URLs.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                YouTube Channel URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-600">
                  <Youtube className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={profile.socialLinks.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instagram Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-600">
                  <Instagram className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={profile.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Facebook Business Page URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-700">
                  <Facebook className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={profile.socialLinks.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/your-business"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                  <Linkedin className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={profile.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                X (Twitter) Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800">
                  <Twitter className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={profile.socialLinks.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://x.com/yourhandle"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UPLOAD DISCLOSURE (KEY USER REQUIREMENT) */}
        {activeTab === 'disclosure' && (
          <div className="space-y-5">
            <div className="bg-[#004372]/5 border border-[#004372]/15 rounded-xl p-3.5 text-xs text-[#004372] flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-[#0076BD] shrink-0 mt-0.5" />
              <div>
                <strong>Compliance Disclosure Placement:</strong> Your uploaded disclosure file or custom text will be placed <strong>directly after the standard guide disclosure</strong> at the end of each guide, along with your logo.
              </div>
            </div>

            {/* Upload Disclosure File Card */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Option A: Upload Compliance Disclosure Document
              </label>
              <div className="p-4 bg-[#E6E6E6]/40 border-2 border-dashed border-slate-300 rounded-xl">
                {profile.uploadedDisclosure ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0076BD]/10 text-[#0076BD] flex items-center justify-center font-bold text-xs">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {profile.uploadedDisclosure.fileName}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">
                          Format: {profile.uploadedDisclosure.fileType.toUpperCase()} Document
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveDisclosure}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800 mb-1">
                      Upload Broker-Dealer / RIA Compliance Disclosure
                    </p>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Accepts PDF files (multi-page/single-page), images, or text files
                    </p>
                    <input
                      ref={disclosureInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                      onChange={handleDisclosureFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => disclosureInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      Select Disclosure File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Or Enter Custom Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Option B: Or Enter Custom Disclosure Text
                </label>
                <span className="text-[11px] text-slate-400">Placed after standard disclosure</span>
              </div>
              <textarea
                rows={5}
                value={profile.disclaimer}
                onChange={(e) => handleFieldChange('disclaimer', e.target.value)}
                placeholder="Enter your firm's specific legal disclosures, state registration notices, or licensing text..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none font-mono leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Rendered below the standard disclosure with a divider line and your agency logo.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Controls */}
      <div className="border-t border-slate-200 p-4 bg-[#E6E6E6]/30 flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Form
        </button>

        <button
          onClick={onSave}
          className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-[#0076BD] hover:bg-[#00629e] text-white shadow-sm transition-colors"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Profile
        </button>
      </div>
    </div>
  );
};
