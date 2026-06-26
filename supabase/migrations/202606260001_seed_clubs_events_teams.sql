-- Seed CAL student clubs, events and teams.
-- Only slug + name are required; remaining content (short_info, long_info,
-- support details) is filled in later via the admin panel.
-- Idempotent: re-running skips rows whose slug already exists.

insert into public.clubs (slug, name) values
  ('satranc-kulubu', 'Satranç Kulübü'),
  ('almanca-kulubu', 'Almanca Kulübü'),
  ('avrupa-birligi-ve-proje-kulubu', 'Avrupa Birliği ve Proje Kulübü'),
  ('gastronomi-kulubu', 'Gastronomi Kulübü'),
  ('girisimcilik-kulubu', 'Girişimcilik Kulübü'),
  ('matematik-kulubu', 'Matematik Kulübü'),
  ('munazara-kulubu', 'Münazara Kulübü'),
  ('sinema-kulubu', 'Sinema Kulübü'),
  ('yasam-bilimleri-kulubu', 'Yaşam Bilimleri Kulübü'),
  ('tarih-kulubu', 'Tarih Kulübü'),
  ('tiyatro-kulubu', 'Tiyatro Kulübü'),
  ('kultur-ve-edebiyat-kulubu', 'Kültür ve Edebiyat Kulübü'),
  ('gezi-kulubu', 'Gezi Kulübü'),
  ('sosyal-sorumluluk-kulubu', 'Sosyal Sorumluluk Kulübü'),
  ('uluslararasi-iliskiler-kulubu', 'Uluslararası İlişkiler Kulübü')
on conflict (slug) do nothing;

insert into public.student_events (slug, name) values
  ('model-g-20-zirvesi-etkinligi', 'Model G-20 Zirvesi Etkinliği'),
  ('calmun-etkinligi', 'CALMUN Etkinliği'),
  ('calfest-etkinligi', 'CALFEST Etkinliği'),
  ('cal-oyunlari-etkinligi', 'CAL Oyunları Etkinliği'),
  ('jugendfest-etkinligi', 'Jugendfest Etkinliği'),
  ('kis-soylesileri-etkinligi', 'Kış Söyleşileri Etkinliği'),
  ('bilim-sanat-gunleri-etkinligi', 'Bilim Sanat Günleri Etkinliği'),
  ('kurulus-etkinligi', 'Kuruluş Etkinliği'),
  ('cale-sportfest-valorant-turnuvasi-etkinligi', 'CALE-Sportfest Valorant Turnuvası Etkinliği'),
  ('cale-sportfest-lol-turnuvasi-etkinligi', 'CALE-Sportfest LoL Turnuvası Etkinliği'),
  ('calsportfest-etkinligi', 'CALSportfest Etkinliği'),
  ('tedxyouth-cal-etkinligi', 'TEDxYouth@CAL Etkinliği'),
  ('piknik-etkinligi', 'Piknik Etkinliği')
on conflict (slug) do nothing;

insert into public.student_teams (slug, name) values
  ('calrov-takimi', 'CALROV Takımı'),
  ('calgame-takimi', 'CALGame Takımı'),
  ('calroket-takimi', 'CALRoket Takımı'),
  ('calsev-takimi', 'CALSEV Takımı'),
  ('cal-iha-takimi', 'CAL İHA Takımı')
on conflict (slug) do nothing;
