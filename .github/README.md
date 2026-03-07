<div align="center">
أبدأ بسم الله الرحمن الرحيم
<img src="https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/tnx_bd/res/welcome.gif" width="100%" style="max-width: 600px; border-radius: 10px;" alt="welcome" />
<br />
<table border="0">
<tr>
<td align="center" width="220" style="border: none;">
<div style="background: linear-gradient(45deg, #58a6ff, #bc8cf2); padding: 3px; border-radius: 50%; display: inline-block;">
<img src="https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/tnx_bd/Main_img.png" width="110" height="110" style="border-radius: 50%; border: 3px solid #0d1117; object-fit: cover; display: block;" />
</div>
<br />
<span style="white-space: nowrap; font-size: 18px; font-weight: bold;">
Tarikul Islam <img src="https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/tnx_bd/res/devil_emoji.gif" width="22" style="vertical-align: middle;">
</span>
</td>
<td width="400" style="border: none; vertical-align: top; padding-top: 10px;">
<img src="https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/tnx_bd/res/hey_buddy.gif" width="120" alt="Hey Buddy" />
<br />
স্বাগতম! এটি তোমার অ্যান্ড্রয়েড APK তৈরির পূর্ণাঙ্গ গাইড। এখানে URL থেকে সরাসরি অ্যাপ এবং React প্রজেক্ট থেকে অ্যাপ তৈরির নিয়ম দেওয়া হলো।
</td>
</tr>
</table>
📱 Build Guide 1: URL to APK (Webview)
এই ফিচারের মাধ্যমে যেকোনো ওয়েবসাইটকে প্রফেশনাল অ্যান্ড্রয়েড অ্যাপে রূপান্তর করা হয়। এতে অটোমেটিক রিফ্রেশ এবং এরর পেজ হ্যান্ডলিং সুবিধা রয়েছে।
প্রয়োজনীয় কনফিগারেশন:
assets/url-metadata.json ফাইলটি নিচের ফরম্যাটে তৈরি করো:
```
{
  "appName": "My Web App",
  "appPackage": "com.web.app",
  "appUrl": "https://example.com",
  "versionName": "1.0.0",
  "versionCode": 1
}
```
⚛️ Build Guide 2: React to APK (with Auto-Update)
React প্রজেক্টকে APK তে রূপান্তর করার পাশাপাশি এতে ইন-অ্যাপ আপডেট সিস্টেম এবং কোড অবফাসকেশন (সুরক্ষা) যুক্ত করা হয়েছে।
মেটাডেটা সেটআপ:
assets/app-metadata.json ফাইলে নিচের তথ্যগুলো দাও:
```
{
  "appName": "শিক্ষা",
  "appPackage": "com.sikkha.tnx",
  "versionName": "3.0.0",
  "versionCode": 3,
  "updateJsonUrl": "https://raw.githubusercontent.com/.../update.json",
  "permissions": ["INTERNET", "READ_EXTERNAL_STORAGE"]
}
```
আপডেট কন্ট্রোল:
তোমার হোস্টিং বা GitHub-এ একটি update.json ফাইল রাখতে হবে:
```
{
  "versionCode": 4,
  "versionName": "4.0.0",
  "updateUrl": "DIRECT_APK_LINK_HERE",
  "message": "নতুন ফিচার যোগ করা হয়েছে!",
  "forceUpdate": true 
}
```
📂 Where to Find Your Files?
বিল্ড সম্পন্ন হওয়ার পর ফাইলগুলো কোথায় পাবে তা নিচে দেওয়া হলো:
 * APK ফাইল: GitHub Actions ট্যাবে গিয়ে সংশ্লিষ্ট রানটি ওপেন করো। একদম নিচে Artifacts সেকশনে তোমার অ্যাপের নামে জিপ ফাইলটি পাবে।
 * Permissions: অ্যাপের সব পারমিশন (যেমন ইন্টারনেট বা স্টোরেজ) অটোমেটিক AndroidManifest.xml-এ ইনজেক্ট হয়ে যাবে।
 * App Icon: তোমার কাস্টম আইকন ব্যবহার করতে চাইলে assets/icon.png (1024x1024 px) ফাইলটি রিপোজিটরিতে আপলোড করে রাখো।
🚀 How to Build
> [!IMPORTANT]
> ধাপ ১: তোমার কোড পুশ করো অথবা Actions ট্যাবে যাও।
> ধাপ ২: বাম পাশ থেকে "Professional Webview APK Builder" অথবা "Build Android APK" সিলেক্ট করো।
> ধাপ ৩: Run workflow বাটনে ক্লিক করো।
> ধাপ ৪: কাজ শেষ হলে Artifacts থেকে অ্যাপটি ডাউনলোড করে নাও!
> 
<img src="https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/tnx_bd/res/thanks.gif" width="100%" style="max-width: 400px;" alt="thanks" />
<p align="center">
<font color="#8b949e">
© 2026 <b>Tarikul Islam</b> | <i>APK Automation v2.5</i> <br />
Building Apps with Termux & GitHub Actions
</font>
</p>
</div>
আমি কি তোমার এই নতুন UpdateChecker.tsx কম্পোনেন্টটি নিয়ে কোনো বিশেষ গাইড বা নোটিফিকেশন সিস্টেম এখানে যোগ করে দেব?
