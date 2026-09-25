import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
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
  FileCheck,
  Users,
  UserPlus,
  Camera,
  Briefcase
} from 'lucide-react';
import { AgentProfile, BrandingOptions, TeamMemberBio } from '../types/index';

interface AgentProfileFormProps {
  profile: AgentProfile;
  onChange: (updated: AgentProfile) => void;
  options: BrandingOptions;
  onOptionsChange: (updated: BrandingOptions) => void;
  onSave: () => void;
  onReset: () => void;
  saveStatus: string | null;
  initialTab?: 'profile' | 'social' | 'disclosure' | 'team' | 'event';
}

export const AgentProfileForm: React.FC<AgentProfileFormProps> = ({
  profile,
  onChange,
  options,
  onOptionsChange,
  onSave,
  onReset,
  saveStatus,
  initialTab = 'profile',
}) => {
  const colorLogoInputRef = useRef<HTMLInputElement>(null);
  const whiteLogoInputRef = useRef<HTMLInputElement>(null);
  const disclosureInputRef = useRef<HTMLInputElement>(null);
  const headshotInputRef1 = useRef<HTMLInputElement>(null);
  const headshotInputRef2 = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'disclosure' | 'team' | 'event'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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

  const handleWorkshopEventChange = (
    field: 'title' | 'date' | 'time' | 'locationName' | 'locationAddress',
    value: string
  ) => {
    onChange({
      ...profile,
      workshopEvent: {
        title: profile.workshopEvent?.title || '',
        date: profile.workshopEvent?.date || '',
        time: profile.workshopEvent?.time || '',
        locationName: profile.workshopEvent?.locationName || '',
        locationAddress: profile.workshopEvent?.locationAddress || '',
        [field]: value,
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

  const handleWhiteLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleFieldChange('logoWhiteDataUrl', dataUrl);
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

  const handleRemoveColorLogo = () => {
    handleFieldChange('logoDataUrl', null);
    if (colorLogoInputRef.current) {
      colorLogoInputRef.current.value = '';
    }
  };

  const handleRemoveWhiteLogo = () => {
    handleFieldChange('logoWhiteDataUrl', null);
    if (whiteLogoInputRef.current) {
      whiteLogoInputRef.current.value = '';
    }
  };

  const teamMembers: TeamMemberBio[] = profile.teamMembers && profile.teamMembers.length > 0
    ? profile.teamMembers
    : [
        {
          id: 'advisor-1',
          name: profile.name || '',
          title: profile.title || '',
          email: profile.email || '',
          phone: profile.phone || '',
          bio: '',
        },
      ];

  const handleUpdateTeamMember = (index: number, field: keyof TeamMemberBio, value: any) => {
    const updated = [...teamMembers];
    if (!updated[index]) {
      updated[index] = {
        id: `advisor-${index + 1}`,
        name: '',
        title: '',
        email: '',
        phone: '',
        bio: '',
      };
    }
    updated[index] = { ...updated[index], [field]: value };
    handleFieldChange('teamMembers', updated);
  };

  const handleHeadshotUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG or JPG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      handleUpdateTeamMember(index, 'headshotDataUrl', evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSecondAdvisor = () => {
    const updated = [...teamMembers];
    if (updated.length < 2) {
      updated.push({
        id: 'advisor-2',
        name: '',
        title: 'Associate Wealth Advisor',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: '',
      });
      handleFieldChange('teamMembers', updated);
    }
  };

  const handleRemoveSecondAdvisor = () => {
    const updated = [teamMembers[0]];
    handleFieldChange('teamMembers', updated);
    if (headshotInputRef2.current) {
      headshotInputRef2.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Tab Navigation */}
      <div className="px-4 sm:px-6 pt-3 flex space-x-2 sm:space-x-5 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'border-[#0076BD] text-[#0076BD]'
              : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          1. Logo & Contact Info
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'social'
              ? 'border-[#0076BD] text-[#0076BD]'
              : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          2. Social Media Links
        </button>
        <button
          onClick={() => setActiveTab('disclosure')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'disclosure'
              ? 'border-[#0076BD] text-[#0076BD]'
              : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          3. Upload Disclosure
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'team'
              ? 'border-[#0076BD] text-[#0076BD]'
              : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          <span>4. Wealth Team & Bios</span>
        </button>
        <button
          onClick={() => setActiveTab('event')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'event'
              ? 'border-[#0076BD] text-[#0076BD]'
              : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#0076BD]" />
          <span>5. Workshop Event</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

        {/* TAB 1: LOGO & CONTACT INFO */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {/* Logo Upload Box - Dual Logo Support (Color + White) */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Agent / Agency Logos
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload color and white versions so your logo looks crisp on both dark covers and white pages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Color Logo (For Light Backgrounds: Contact & Disclosure Pages) */}
                <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0076BD]"></span>
                      Color Logo
                    </span>
                    <p className="text-[10px] text-slate-500">Contact & Disclosure Pages (White BG)</p>
                  </div>

                  <div className="relative group w-full h-20 bg-white rounded-lg flex items-center justify-center p-2 overflow-hidden shadow-xs">
                    {profile.logoDataUrl ? (
                      <>
                        <img
                          src={profile.logoDataUrl}
                          alt="Color Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveColorLogo}
                          title="Remove color logo"
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5 mb-0.5 text-slate-400" />
                        <span className="text-[10px]">No Color Logo</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      ref={colorLogoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => colorLogoInputRef.current?.click()}
                      className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {profile.logoDataUrl ? 'Replace Color Logo' : 'Upload Color Logo'}
                    </button>
                  </div>
                </div>

                {/* 2. White Logo (For Dark Backgrounds: Cover Page Lower-Left) */}
                <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                      White / Knockout Logo
                    </span>
                    <p className="text-[10px] text-slate-500">Cover Page Lower-Left (Dark BG)</p>
                  </div>

                  <div className="relative group w-full h-20 bg-[#004372] rounded-lg flex items-center justify-center p-2 overflow-hidden shadow-xs">
                    {profile.logoWhiteDataUrl ? (
                      <>
                        <img
                          src={profile.logoWhiteDataUrl}
                          alt="White Knockout Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveWhiteLogo}
                          title="Remove white logo"
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-blue-200/60">
                        <ImageIcon className="w-5 h-5 mb-0.5 text-blue-200/60" />
                        <span className="text-[10px]">No White Logo</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      ref={whiteLogoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleWhiteLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => whiteLogoInputRef.current?.click()}
                      className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {profile.logoWhiteDataUrl ? 'Replace White Logo' : 'Upload White Logo'}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-blue-50/50 rounded-lg p-2.5">
                <strong>Placement:</strong> White logo automatically placed on the dark cover page (lower-left). Color logo placed on the white Contact and Disclosure pages. If only one logo is uploaded, it will automatically adapt to all pages.
              </p>
            </div>

            {/* Advisor Details - All Fields Full Width */}
            <div className="space-y-4">
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

              <div>
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
            <div className="bg-[#004372]/5 rounded-xl p-3.5 text-xs text-[#004372]">
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
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UPLOAD DISCLOSURE (KEY USER REQUIREMENT) */}
        {activeTab === 'disclosure' && (
          <div className="space-y-5">
            <div className="bg-[#004372]/5 rounded-xl p-3.5 text-xs text-[#004372] flex items-start space-x-2">
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
              <div className="p-4 bg-[#E6E6E6]/40 rounded-xl">
                {profile.uploadedDisclosure ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-xs">
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

        {/* TAB 4: WEALTH TEAM & BIOS */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-[#004372]/5 rounded-xl p-3.5 text-xs text-[#004372] flex items-start space-x-2">
              <Users className="w-4 h-4 text-[#0076BD] shrink-0 mt-0.5" />
              <div>
                <strong>Simplicity Wealth Co-Branded Materials:</strong> Custom headshot(s) and biography text will be stamped directly on <strong>Page 5 (&quot;Wealth Manager&quot;)</strong> of the <em>Our Team Prestige Brochure</em>, replacing the placeholder photos and Latin text.
              </div>
            </div>

            {/* ADVISOR 1 (PRIMARY) */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0076BD]" />
                  Advisor 1 (Primary Advisor)
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Featured on Page 5
                </span>
              </div>

              {/* Headshot Upload Tile */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                  {teamMembers[0]?.headshotDataUrl ? (
                    <img
                      src={teamMembers[0].headshotDataUrl}
                      alt={teamMembers[0].name || 'Advisor 1'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Advisor 1 Headshot Photo
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Square JPG/PNG portrait recommended (minimum 400×400px).
                  </p>
                  <input
                    ref={headshotInputRef1}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleHeadshotUpload(0, e)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => headshotInputRef1.current?.click()}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {teamMembers[0]?.headshotDataUrl ? 'Replace Photo' : 'Upload Headshot'}
                    </button>
                    {teamMembers[0]?.headshotDataUrl && (
                      <button
                        type="button"
                        onClick={() => handleUpdateTeamMember(0, 'headshotDataUrl', undefined)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form fields for Advisor 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Advisor Name & Credentials
                  </label>
                  <input
                    type="text"
                    value={teamMembers[0]?.name || ''}
                    onChange={(e) => handleUpdateTeamMember(0, 'name', e.target.value)}
                    placeholder="e.g. John Smith, CFP®, ChFC®"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Title / Position
                  </label>
                  <input
                    type="text"
                    value={teamMembers[0]?.title || ''}
                    onChange={(e) => handleUpdateTeamMember(0, 'title', e.target.value)}
                    placeholder="e.g. Founder & Managing Director"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={teamMembers[0]?.email || ''}
                    onChange={(e) => handleUpdateTeamMember(0, 'email', e.target.value)}
                    placeholder="e.g. jsmith@compassadvisors.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Direct Phone
                  </label>
                  <input
                    type="text"
                    value={teamMembers[0]?.phone || ''}
                    onChange={(e) => handleUpdateTeamMember(0, 'phone', e.target.value)}
                    placeholder="e.g. (800) 866-8666"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Advisor Biography
                </label>
                <textarea
                  rows={4}
                  value={teamMembers[0]?.bio || ''}
                  onChange={(e) => handleUpdateTeamMember(0, 'bio', e.target.value)}
                  placeholder="Enter 1-2 paragraphs detailing your educational background, fiduciary philosophy, and wealth management experience..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* ADVISOR 2 (OPTIONAL) */}
            {teamMembers.length > 1 ? (
              <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0076BD]" />
                    Advisor 2 (Associate / Co-Advisor)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveSecondAdvisor}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Advisor 2
                  </button>
                </div>

                {/* Headshot Upload Tile */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                    {teamMembers[1]?.headshotDataUrl ? (
                      <img
                        src={teamMembers[1].headshotDataUrl}
                        alt={teamMembers[1].name || 'Advisor 2'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Advisor 2 Headshot Photo
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Square JPG/PNG portrait recommended (minimum 400×400px).
                    </p>
                    <input
                      ref={headshotInputRef2}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => handleHeadshotUpload(1, e)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => headshotInputRef2.current?.click()}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {teamMembers[1]?.headshotDataUrl ? 'Replace Photo' : 'Upload Headshot'}
                      </button>
                      {teamMembers[1]?.headshotDataUrl && (
                        <button
                          type="button"
                          onClick={() => handleUpdateTeamMember(1, 'headshotDataUrl', undefined)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form fields for Advisor 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Advisor Name & Credentials
                    </label>
                    <input
                      type="text"
                      value={teamMembers[1]?.name || ''}
                      onChange={(e) => handleUpdateTeamMember(1, 'name', e.target.value)}
                      placeholder="e.g. Caroline Jensen, ChFC®"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Title / Position
                    </label>
                    <input
                      type="text"
                      value={teamMembers[1]?.title || ''}
                      onChange={(e) => handleUpdateTeamMember(1, 'title', e.target.value)}
                      placeholder="e.g. Associate Wealth Advisor"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Direct Email
                    </label>
                    <input
                      type="email"
                      value={teamMembers[1]?.email || ''}
                      onChange={(e) => handleUpdateTeamMember(1, 'email', e.target.value)}
                      placeholder="e.g. cjensen@compassadvisors.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Direct Phone
                    </label>
                    <input
                      type="text"
                      value={teamMembers[1]?.phone || ''}
                      onChange={(e) => handleUpdateTeamMember(1, 'phone', e.target.value)}
                      placeholder="e.g. (800) 866-8666"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Advisor Biography
                  </label>
                  <textarea
                    rows={4}
                    value={teamMembers[1]?.bio || ''}
                    onChange={(e) => handleUpdateTeamMember(1, 'bio', e.target.value)}
                    placeholder="Enter 1-2 paragraphs detailing their background, areas of focus, and client advisory experience..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddSecondAdvisor}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-[#0076BD] bg-sky-50/60 hover:bg-sky-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Second Advisor / Team Member to Page 5</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 5: WORKSHOP EVENT DETAILS */}
        {activeTab === 'event' && (
          <div className="space-y-5">
            <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-100/80">
              <h3 className="text-xs font-bold text-[#004372] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0076BD]" />
                Workshop & Presentation Details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Configure your upcoming seminar or client workshop details. These dynamically co-brand the Workshop Overview Flyer, Office Directions, Notes Sheets, and Response Forms with zero overlap.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Workshop / Event Title
              </label>
              <input
                type="text"
                value={profile.workshopEvent?.title || ''}
                onChange={(e) => handleWorkshopEventChange('title', e.target.value)}
                placeholder="e.g. Simplifying College Planning"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Event Date
                </label>
                <input
                  type="text"
                  value={profile.workshopEvent?.date || ''}
                  onChange={(e) => handleWorkshopEventChange('date', e.target.value)}
                  placeholder="e.g. Tuesday, October 20, 2026"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Event Time
                </label>
                <input
                  type="text"
                  value={profile.workshopEvent?.time || ''}
                  onChange={(e) => handleWorkshopEventChange('time', e.target.value)}
                  placeholder="e.g. 6:00 PM - 7:30 PM"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Venue / Location Name
              </label>
              <input
                type="text"
                value={profile.workshopEvent?.locationName || ''}
                onChange={(e) => handleWorkshopEventChange('locationName', e.target.value)}
                placeholder="e.g. Piattino's Italian Restaurant or Compass Wealth Training Center"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Venue Address & Location Details
              </label>
              <textarea
                rows={3}
                value={profile.workshopEvent?.locationAddress || ''}
                onChange={(e) => handleWorkshopEventChange('locationAddress', e.target.value)}
                placeholder="e.g. 900 Summit Avenue&#10;Summit, New Jersey 07901"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0076BD] outline-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Enter the street address, suite, and city/state/zip. Used for event flyers and office directions.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Controls */}
      <div className="p-4 bg-white flex items-center">
        <button
          onClick={onReset}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
          Reset Form
        </button>
      </div>
    </div>
  );
};
