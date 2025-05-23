module.exports = {
    register: [
        {
            name: 'Register Yetkilisi',
            value: 'registerAuth',
            description: 'Kayıt yetkilisini ayarlarsınız.',
            type: 'role',
            isMultiple: true,
            emoji: '👮',
        },
        {
            name: 'Register Kanalı',
            value: 'registerChannel',
            description: 'Register kanalını belirlersiniz.',
            type: 'channel',
            isParent: false,
            isVoice: false,
            emoji: '📝',
        },
        {
            name: 'Transfer Kanalı',
            value: 'transferChannel',
            description: 'Kayıttan sonra üyeyi\'nin taşınacağı kanal.',
            type: 'channel',
            isParent: false,
            isVoice: true,
            emoji: '📝',
        },
        {
            name: 'Tag/Taglar',
            value: 'tags',
            description: 'Sunucu tagını ayarlarsınız.',
            type: 'string',
            isMultiple: false,
            isNumber: false,
            emoji: '🏷️',
        },
        {
            name: 'Erkek Rolleri',
            value: 'manRoles',
            description: 'Erkek rollerini belirtirsiniz.',
            type: 'role',
            isMultiple: true,
            emoji: '👨',
        },
        {
            name: 'Kadın Rolleri',
            value: 'womanRoles',
            description: 'Kadın rollerini belirtirsiniz.',
            type: 'role',
            isMultiple: true,
            emoji: '👩',
        },
        {
            name: 'Kayıtsız Rolleri',
            value: 'unregisterRoles',
            description: 'Kayıtsız rolü ve sunucuya giren kullanıcılara verilecek rol.',
            type: 'role',
            isMultiple: true,
            emoji: '👤',
        },
        {
            name: 'Genel Kayıt Rolü',
            value: 'registeredRole',
            description: 'Kayıt edilince herkese verilen rol.',
            type: 'role',
            isMultiple: false,
            emoji: '👥',
        },
        {
            name: 'Şüpheli Rolü',
            value: 'suspectedRole',
            description: 'Şüpheli rolünü belirtirsiniz.',
            type: 'role',
            isMultiple: false,
            emoji: '🤔',
        },
        {
            name: 'Yasaklı Tag Rolü',
            value: 'bannedTagRole',
            description: 'Yasaklı Tag rolünü belirtirsiniz.',
            type: 'role',
            isMultiple: false,
            emoji: '🚫',
        },
        {
            name: 'Register Kategorisi',
            value: 'registerParent',
            description: 'Register kategorisini belirtirsiniz.',
            type: 'channel',
            isParent: true,
            isVoice: false,
            emoji: '📝',
        },
        {
            name: 'Taglı Rolü',
            value: 'familyRole',
            description: 'Sunucu taglı rolünü ayarlarsınız.',
            type: 'role',
            isMultiple: false,
            emoji: '👪',
        },
        {
            name: 'Kayıtsız Limiti',
            value: 'unregistered',
            description: 'Yetkililerin belirttiğiniz süre içinde atabileceği kayıtsız miktarı.',
            limitler:["1","5","8","10","12","15","20","25","30"],
            type: 'limit',
            emoji: '👤',
        },
        {
            name: 'Taglı Alım Modu',
            value: 'taggedMode',
            description: 'Taglı alım modunu ayarlarsınız.',
            type: 'boolean',
            emoji: '👪',
        },
        {
            name: 'İsim Yaş Sistemli Kayıt',
            value: 'nameAgeSystem',
            description: 'Kapatırsanız Kayıt edilince kullanıcıya sadece genel kayıt rolü verir.',
            type: 'boolean',
            emoji: '👤',
        },
        {
            name: 'Kayıt Sistemi Yaş Zorunluluğu',
            value: 'needAge',
            description: 'Sunucu kayıt için yaş zorunluluğu.(Sadece isim ile kayıt olur)',
            type: 'boolean',
            emoji: '👤',
        },
        {
            name: 'İsim Değiştirme Sistemi',
            value: 'changeName',
            description: 'Kayıt edilince kullanıcının isminin değiştirilmesi.',
            type: 'boolean',
            emoji: '👤',
        },
        { name: 'Oto Kayıt Sistemi', value: 'autoRegister', description: 'Önceden kayıtlıysa kayıt edilir.', type: 'boolean', emoji: '👤' },
        {
            name: 'Register Sistemi',
            value: 'registerSystem',
            description: 'Register sistemini açar kapatırsınız.',
            type: 'boolean',
            emoji: '📝',
        },
        
    ],
moderation: [
    {
        name: 'Kadın Rolleri',
        value: 'womanRoles',
        description: 'Kadın rollerini belirtirsiniz.',
        type: 'role',
        isMultiple: true,
        emoji: '👩',
    },
]
}