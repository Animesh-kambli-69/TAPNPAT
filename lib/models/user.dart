class User {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? avatarUrl;
  final String nfcId;

  const User({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.avatarUrl,
    required this.nfcId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      nfcId: json['nfcId'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'email': email,
      'avatarUrl': avatarUrl,
      'nfcId': nfcId,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? phone,
    String? email,
    String? avatarUrl,
    String? nfcId,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      nfcId: nfcId ?? this.nfcId,
    );
  }

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}
