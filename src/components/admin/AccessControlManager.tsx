"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check,
  Crown,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import {
  MasterAccessConfig,
  DEFAULT_ACCESS_CONFIG,
} from "@/lib/siteContent";

interface AccessControlManagerProps {
  config: MasterAccessConfig;
  onChange: (updated: MasterAccessConfig) => void;
  onSave: () => void;
  isSaved: boolean;
  onReset: () => void;
}

export default function AccessControlManager({
  config,
  onChange,
  onSave,
  isSaved,
  onReset,
}: AccessControlManagerProps) {
  const [showSuperPass, setShowSuperPass] = useState(false);
  const [showOfficerPass, setShowOfficerPass] = useState(false);
  const [activeTab, setActiveTab] = useState<"passcodes" | "permissions" | "features">("permissions");

  // Helpers
  const updateSecurity = (field: "super_passcode" | "officer_passcode", val: string) => {
    onChange({
      ...config,
      security: {
        ...config.security,
        [field]: val,
      },
    });
  };

  const updateOfficerPerm = (
    module: "members" | "events" | "resources" | "leadership",
    action: string,
    val: boolean
  ) => {
    onChange({
      ...config,
      officerPermissions: {
        ...config.officerPermissions,
        [module]: {
          ...(config.officerPermissions as any)[module],
          [action]: val,
        },
      },
    });
  };

  const updateFeature = (field: keyof MasterAccessConfig["features"], val: any) => {
    onChange({
      ...config,
      features: {
        ...config.features,
        [field]: val,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="font-serif font-bold text-xl text-[#0A2540] flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span>Super User — Access Control & Security Suite</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure passwords, granular section permissions for Content Admins (Officers), and public portal feature toggles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Live!</span>
            </span>
          )}
          <button
            onClick={onSave}
            className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Security Config</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="px-6 border-b border-slate-200 flex gap-2">
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "permissions"
              ? "border-[#0A2540] text-[#0A2540] bg-white font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Officer Section Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab("passcodes")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "passcodes"
              ? "border-[#0A2540] text-[#0A2540] bg-white font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Passcodes & Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "features"
              ? "border-[#0A2540] text-[#0A2540] bg-white font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Portal Feature Toggles</span>
        </button>
      </div>

      {/* Tab 1: Granular Section Permissions */}
      {activeTab === "permissions" && (
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Crown className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Role Enforcement Notice:</span> When an officer signs in using the Content Admin passcode, they will strictly be permitted to access only the modules and actions enabled below. Super Users always retain 100% full access.
            </div>
          </div>

          <div className="space-y-4">
            {/* Module 1: Members Directory */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0A2540]" />
                  <span className="font-serif font-bold text-sm text-[#0A2540]">
                    1. Members Directory Access
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-600">Tab Visible to Officers</span>
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.members.view}
                    onChange={(e) => updateOfficerPerm("members", "view", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540] focus:ring-0"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.members.add}
                    onChange={(e) => updateOfficerPerm("members", "add", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Registering / Adding Members</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.members.edit}
                    onChange={(e) => updateOfficerPerm("members", "edit", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Editing Member Details</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer text-red-700">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.members.delete}
                    onChange={(e) => updateOfficerPerm("members", "delete", e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span>Allow Deleting Member Records</span>
                </label>
              </div>
            </div>

            {/* Module 2: Assemblies & Events */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0A2540]" />
                  <span className="font-serif font-bold text-sm text-[#0A2540]">
                    2. Assemblies & Calendar Events
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-600">Tab Visible to Officers</span>
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.events.view}
                    onChange={(e) => updateOfficerPerm("events", "view", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540] focus:ring-0"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.events.add}
                    onChange={(e) => updateOfficerPerm("events", "add", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Creating Convocations</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.events.edit}
                    onChange={(e) => updateOfficerPerm("events", "edit", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Editing Event Agenda</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer text-red-700">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.events.delete}
                    onChange={(e) => updateOfficerPerm("events", "delete", e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span>Allow Deleting Assemblies</span>
                </label>
              </div>
            </div>

            {/* Module 3: Academic Resources */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0A2540]" />
                  <span className="font-serif font-bold text-sm text-[#0A2540]">
                    3. Academic Resources & Study Kits
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-600">Tab Visible to Officers</span>
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.resources.view}
                    onChange={(e) => updateOfficerPerm("resources", "view", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540] focus:ring-0"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.resources.add}
                    onChange={(e) => updateOfficerPerm("resources", "add", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Uploading Reviewer Links</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.resources.edit}
                    onChange={(e) => updateOfficerPerm("resources", "edit", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Editing Resource Info</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer text-red-700">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.resources.delete}
                    onChange={(e) => updateOfficerPerm("resources", "delete", e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span>Allow Deleting Free Materials</span>
                </label>
              </div>
            </div>

            {/* Module 4: Leadership & Faculty */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#0A2540]" />
                  <span className="font-serif font-bold text-sm text-[#0A2540]">
                    4. Leadership & Faculty Directory
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-600">Tab Visible to Officers</span>
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.leadership.view}
                    onChange={(e) => updateOfficerPerm("leadership", "view", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540] focus:ring-0"
                  />
                </label>
              </div>

              <div className="text-xs pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer max-w-sm">
                  <input
                    type="checkbox"
                    checked={config.officerPermissions.leadership.edit}
                    onChange={(e) => updateOfficerPerm("leadership", "edit", e.target.checked)}
                    className="w-4 h-4 rounded text-[#0A2540]"
                  />
                  <span>Allow Officers to Edit Officers & Faculty Posts</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Passcodes Configuration */}
      {activeTab === "passcodes" && (
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#0A2540] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Encrypted Credentials:</span> Change the passcodes used to unlock the dashboard. Passcodes are kept confidential and never displayed on public login screens.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Super User Passcode */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="font-serif font-bold text-sm text-[#0A2540]">
                  Super User Master Passcode
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Grants absolute system control, master overview editing, and access delegation.
              </p>

              <div className="relative">
                <input
                  type={showSuperPass ? "text" : "password"}
                  value={config.security.super_passcode}
                  onChange={(e) => updateSecurity("super_passcode", e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-[#0A2540] font-mono font-bold text-[#0A2540]"
                />
                <button
                  type="button"
                  onClick={() => setShowSuperPass(!showSuperPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSuperPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Officer Passcode */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0A2540]" />
                <span className="font-serif font-bold text-sm text-[#0A2540]">
                  Content Admin (Officers) Passcode
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Shared with student executive officers for day-to-day operations.
              </p>

              <div className="relative">
                <input
                  type={showOfficerPass ? "text" : "password"}
                  value={config.security.officer_passcode}
                  onChange={(e) => updateSecurity("officer_passcode", e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A2540] font-mono font-bold text-[#0A2540]"
                />
                <button
                  type="button"
                  onClick={() => setShowOfficerPass(!showOfficerPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOfficerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Public Portal Feature Controls */}
      {activeTab === "features" && (
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-500">
            Enable or restrict public visitor features on the JPAMA web portal.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">Public Student Verification Directory</p>
                <p className="text-xs text-slate-500">Allows scholars to check active registration using ID on homepage.</p>
              </div>
              <input
                type="checkbox"
                checked={config.features.publicLookup}
                onChange={(e) => updateFeature("publicLookup", e.target.checked)}
                className="w-5 h-5 rounded text-[#0A2540] focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">Online Membership Registration Form</p>
                <p className="text-xs text-slate-500">Accepts new membership applications from Louisian students.</p>
              </div>
              <input
                type="checkbox"
                checked={config.features.registrationOpen}
                onChange={(e) => updateFeature("registrationOpen", e.target.checked)}
                className="w-5 h-5 rounded text-[#0A2540] focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">Public Academic Resource Downloads</p>
                <p className="text-xs text-slate-500">Enable free access to syllabus reviewers and exam primers.</p>
              </div>
              <input
                type="checkbox"
                checked={config.features.resourceDownloads}
                onChange={(e) => updateFeature("resourceDownloads", e.target.checked)}
                className="w-5 h-5 rounded text-[#0A2540] focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">Alumni Directory Public Visibility</p>
                <p className="text-xs text-slate-500">Displays graduate directory link under About menu.</p>
              </div>
              <input
                type="checkbox"
                checked={config.features.alumniVisible}
                onChange={(e) => updateFeature("alumniVisible", e.target.checked)}
                className="w-5 h-5 rounded text-[#0A2540] focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Emergency Ticker / Maintenance Banner Notice (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank for normal operations..."
                value={config.features.maintenanceNotice}
                onChange={(e) => updateFeature("maintenanceNotice", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2540]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <button
          onClick={() => {
            if (confirm("Reset access and security settings to factory defaults?")) {
              onChange(DEFAULT_ACCESS_CONFIG);
              onReset();
            }
          }}
          className="px-3.5 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#14487A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Master Configuration</span>
        </button>
      </div>
    </div>
  );
}
