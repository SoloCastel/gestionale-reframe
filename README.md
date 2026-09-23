# Gestionale ReFrame

Prototipo operativo del gestionale commerciale e produttivo di ReFrame Hub.

Il gestionale parte senza dati dimostrativi e consente di inserire persone, clienti, servizi, listini individuali, opportunità, progetti e task. Tutti i progetti aperti sono visibili al team; il filtro **Solo i miei** e la sezione **Il mio lavoro** mostrano esclusivamente task e follow-up collegati al profilo attivo.

I dati sono salvati nel database Supabase del workspace ReFrame e sincronizzati tra dispositivi. L'accesso è protetto da Supabase Auth e dalle policy RLS del database.

Per avviarlo in locale basta servire la cartella con un server statico, ad esempio `python3 -m http.server 4173`.
